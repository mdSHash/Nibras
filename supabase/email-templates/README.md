# Supabase Auth email templates («تحدي اليوم»)

Pasted into Supabase → Authentication → Emails → Templates (editable only once custom SMTP is set,
docs/OWNER_DASHBOARD.md). Arabic only; `{{ .ConfirmationURL }}` is Supabase's link (PKCE, one use, one hour).

| Template | Subject | Body |
| --- | --- | --- |
| Confirm sign up | أكّد إيميلك عشان تبدأ في تحدي اليوم | `confirm-signup.html` |
| Reset password | رابط تغيير الباسورد – تحدي اليوم | `reset-password.html` |
| Password changed (Security, turn on) | الباسورد بتاعك اتغيّر – تحدي اليوم | `password-changed.html` |
