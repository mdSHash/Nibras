// «تحدي اليوم» accounts (Phase 6) with a mocked Supabase and /api/challenge: the result's offer
// (under the 5G end), Google sign-in (13+ first), the first-sign-in merge, the leaderboard, «حسابي».
import type { Page } from '@playwright/test';
import { test, expect } from './support/fixtures';
import { cairoToday, daysAgo, mockAccounts, signedIn, won } from './support/accountMock';

async function playOneRound(page: Page): Promise<void> {
  await page.goto('challenge/');
  await page.getByRole('dialog').getByRole('button', { name: /لسه ببتدي/ }).click();
  while (!(await page.locator('.win').isVisible())) await page.locator('.cards .opt:not([disabled])').first().click();
}

test.describe('challenge accounts', () => {
  // The first join of a new player has no name yet and is refused with 400 on purpose (the name sheet opens).
  test.use({ viewport: { width: 390, height: 844 }, allowedConsoleErrors: [/status of 400/] });

  test('the result offers sign-in under the 5G end; 13+ first, then Google, a name, and the guest is merged @phone', async ({ page }) => {
    const m = await mockAccounts(page, [won(daysAgo(2)), won(daysAgo(1))]);
    await playOneRound(page);
    const won_ = await page.locator('.win.lost').count() === 0;

    // The 5G end keeps its order: share, today's cards, then the offer under the countdown; the bar stays fixed.
    const order = await page.locator('.sh-btn, .deck, .countdown, .save-offer').evaluateAll((els) => els.map((e) => e.className.split(' ')[0]));
    expect(order).toEqual(['sh-btn', 'deck', 'countdown', 'save-offer']);
    await expect(page.locator('.dock')).toHaveCSS('position', 'fixed');

    await page.locator('.save-offer').getByRole('button', { name: 'ادخل بحساب جوجل' }).click();
    const sheet = page.getByRole('dialog', { name: 'احفظ إنجازاتك' });
    const google = sheet.getByRole('button', { name: 'ادخل بحساب جوجل' });
    await expect(google).toBeDisabled();
    await sheet.getByLabel('عندي ١٣ سنة أو أكتر').check();
    await google.click();

    // Back from "Google": the code is exchanged with its verifier and removed from the address.
    const names = page.getByRole('dialog', { name: 'اختار اسمك في اللوحة' });
    await expect(names).toBeVisible();
    expect(m.tokenBodies[0]).toMatchObject({ auth_code: 'test-code', code_verifier: expect.stringMatching(/^[\w-]{43,}$/) });
    expect(page.url()).not.toContain('code=');
    const field = names.getByLabel('الاسم اللي هيظهر للناس');
    await field.fill('م');
    await field.blur();
    await expect(names.getByRole('alert')).toHaveText('الاسم لازم يكون حرفين على الأقل.');
    await field.fill('سيف الدين');
    await names.getByRole('button', { name: 'احفظ وكمّل' }).click();
    await expect(page.locator('.save-done')).toContainText('اتحفظت في حسابك يا سيف الدين');

    // The join carried this browser's id, today's round with its picks, and the age confirmation.
    const join = m.api.filter((c) => c.action === 'join').at(-1)!;
    expect(join).toMatchObject({ name: 'سيف الدين', ageConfirmed: true, deviceId: expect.stringMatching(/^[0-9a-f-]{36}$/), auth: 'Bearer tok-1' });
    expect(join.plays).toEqual([expect.objectContaining({ date: cairoToday(), level: 'easy', mode: 'who', picks: expect.any(Array) })]);
    // The account's two earlier days and today's win make one streak in the header.
    if (won_) await expect(page.locator('.hdr-sub')).toContainText('٣ أيام ورا بعض');

    // The next round is sent while signed in, with its picks.
    await page.locator('.more-i.next').click();
    await expect(page.getByRole('tab', { name: /^المعركة/ })).toHaveAttribute('aria-selected', 'true');
    while (!(await page.locator('.win').isVisible())) await page.locator('.cards .opt:not([disabled])').first().click();
    await expect.poll(() => m.api.filter((c) => c.action === 'result').length).toBe(1);
    expect(m.api.find((c) => c.action === 'result')).toMatchObject({ mode: 'battle', level: 'easy', date: cairoToday(), picks: expect.any(Array) });
  });

  test('the leaderboard: a guest sees it and an invitation; a player sees their own row pinned @phone', async ({ page }) => {
    const m = await mockAccounts(page);
    await page.goto('challenge/#board');
    await page.getByRole('dialog').getByRole('button', { name: /لسه ببتدي/ }).click();
    await expect(page.getByRole('heading', { name: 'لوحة الصدارة' })).toBeVisible();
    await expect(page.locator('.bd-list.acc-card li')).toHaveCount(10);
    await expect(page.getByText('اللوحة لأصحاب الحسابات')).toBeVisible();
    expect(m.board[0]).toMatchObject({ p_level: 'easy', p_period: 'day', auth: null });
    await page.getByRole('group', { name: 'المدة' }).getByRole('button', { name: 'أطول سلسلة' }).click();
    await expect.poll(() => m.board.at(-1)).toMatchObject({ p_period: 'streak' });
    await page.getByRole('group', { name: 'المستوى' }).getByRole('button', { name: 'أستاذ فيها' }).click();
    await expect.poll(() => m.board.at(-1)).toMatchObject({ p_level: 'hard', p_period: 'streak' });

    // Signed in (a saved session): the player's own row, 14th, pinned under the top 10.
    m.name = 'نور';
    await page.evaluate(() => localStorage.setItem('nibras.challenge.session', JSON.stringify({ access_token: 'tok-1', refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: 'u1' } })));
    await page.reload();
    await expect(page.locator('.bd-row.pinned')).toContainText('نور');
    await expect(page.locator('.bd-row.pinned .bd-rank')).toHaveText('١٤');
    expect(m.board.at(-1)).toMatchObject({ auth: 'Bearer tok-1' });
  });

  test('«حسابي»: name, streaks, calendar, rename, sign out, and delete after a confirmation @phone', async ({ page }) => {
    const m = await mockAccounts(page, [won(daysAgo(1)), won(cairoToday(), 'era'), { ...won(daysAgo(1), 'who'), level: 'mid' }]);
    m.name = 'هاني';
    await signedIn(page);
    await page.goto('challenge/#account');
    await page.getByRole('dialog').getByRole('button', { name: /لسه ببتدي/ }).click();
    await expect(page.getByRole('heading', { name: 'حسابي' })).toBeVisible();
    await expect(page.locator('.acc-name b')).toHaveText('هاني');
    await expect(page.locator('.streaks div').first()).toContainText('٢');
    await expect(page.locator('.cal-day.won')).not.toHaveCount(0);
    await expect(page.locator('.hist li')).toHaveCount(3);

    await page.getByRole('button', { name: 'غيّر الاسم' }).click();
    await page.getByLabel('اسمك الجديد').fill('http');
    await page.getByRole('button', { name: 'احفظ', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText('اختار اسم تاني من فضلك.');
    await page.getByLabel('اسمك الجديد').fill('هاني ٢');
    await page.getByRole('button', { name: 'احفظ', exact: true }).click();
    await expect(page.locator('.acc-name b')).toHaveText('هاني ٢');

    await page.getByRole('button', { name: 'احذف حسابي وبياناتي' }).click();
    await page.getByRole('button', { name: 'لأ، سيبه' }).click();
    expect(m.api.some((c) => c.action === 'delete')).toBe(false);
    await page.getByRole('button', { name: 'احذف حسابي وبياناتي' }).click();
    await page.getByRole('button', { name: 'آه، امسح كل حاجة' }).click();
    await expect.poll(() => m.api.find((c) => c.action === 'delete')).toMatchObject({ deviceId: expect.stringMatching(/^[0-9a-f-]{36}$/) });
    await expect(page.locator('.win, .cards')).not.toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem('nibras.challenge.session'))).toBeNull();

    await page.goto('challenge/#privacy');
    await expect(page.getByRole('heading', { name: 'إيه اللي بنحفظه عنك وليه' })).toBeVisible();
  });

  test('a guest who never signs in plays as before, with the offer and no unexpected requests', async ({ page, network }) => {
    await playOneRound(page);
    await expect(page.locator('.save-offer')).toBeVisible();
    expect(network.unexpected).toEqual([]);
  });
});
