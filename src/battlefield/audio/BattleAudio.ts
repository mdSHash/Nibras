/**
 * BattleAudio — synthesized sound effects driven by EventBus events.
 *
 * Uses the Web Audio API directly; no sound files required. Each effect is a
 * short envelope-shaped oscillator + noise burst. The system listens for
 * scripted/combat events on the EventBus and plays the appropriate effect.
 *
 * Sounds:
 *   clash:    low-mid noise burst with quick decay (combat:engagement_started)
 *   charge:   ascending tone (phase containing 'charge' or 'attack' starts)
 *   defeat:   descending tone (combat:unit_destroyed / unit_routed)
 *   takbir:   chord cluster with slight pitch bend (Muslim charge)
 *   horn:     low brass-like tone (battle start)
 *
 * Audio context is created lazily on the first user interaction (required by
 * browser autoplay policies). Until that interaction the audio system is a
 * no-op so it never throws or breaks the simulation.
 *
 * Design note: synthesized audio is a placeholder until real samples are
 * dropped in. The system is intentionally easy to swap out — `play(name)` is
 * the only call site, so future asset loading can replace the synth path
 * without touching the engine.
 */

import type { EventBus } from '../core/EventBus';
import type { Subscription } from '../types/events';

type SfxName = 'clash' | 'charge' | 'defeat' | 'takbir' | 'horn';

export class BattleAudio {
  private eventBus: EventBus;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private subscriptions: Subscription[] = [];

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.subscribe();
    // Lazily create the AudioContext on first user interaction. Browsers
    // require a gesture before audio can start; a click or touch suffices.
    if (typeof window !== 'undefined') {
      const unlock = () => this.ensureContext();
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 0.6;
  }

  destroy(): void {
    for (const sub of this.subscriptions) sub.unsubscribe();
    this.subscriptions = [];
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
      this.master = null;
    }
  }

  private ensureContext(): AudioContext | null {
    if (this.ctx) return this.ctx;
    if (typeof window === 'undefined') return null;
    const Ctor =
      (window.AudioContext as typeof AudioContext | undefined) ??
      ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!Ctor) return null;
    try {
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = this.muted ? 0 : 0.6;
      master.connect(ctx.destination);
      this.ctx = ctx;
      this.master = master;
      return ctx;
    } catch {
      return null;
    }
  }

  /** Subscribe to engine events and translate them into sound effects. */
  private subscribe(): void {
    this.subscriptions.push(
      this.eventBus.on('combat:engagement_started', () => this.play('clash')),
      this.eventBus.on('combat:unit_destroyed', () => this.play('defeat')),
      this.eventBus.on('combat:unit_routed', () => this.play('defeat')),
      this.eventBus.on('phase:started', (e) => {
        const name = (e.payload?.phaseName ?? '').toLowerCase();
        if (/charge|attack|advance|assault/.test(name)) this.play('charge');
        else if (/takbir|allah|victory|fath/.test(name)) this.play('takbir');
        else this.play('horn');
      })
    );
  }

  /** Public API for explicit triggers. */
  play(name: SfxName): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.master || this.muted) return;
    switch (name) {
      case 'clash':    return this.playClash(ctx);
      case 'charge':   return this.playCharge(ctx);
      case 'defeat':   return this.playDefeat(ctx);
      case 'takbir':   return this.playTakbir(ctx);
      case 'horn':     return this.playHorn(ctx);
    }
  }

  // ─── Synth voices ─────────────────────────────────────────────────────────

  private playClash(ctx: AudioContext): void {
    // Noise burst + low thud
    const t = ctx.currentTime;
    const noiseDur = 0.18;
    const buf = ctx.createBuffer(1, ctx.sampleRate * noiseDur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 0.7;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + noiseDur);
    noise.connect(noiseFilter).connect(noiseGain).connect(this.master!);
    noise.start(t);
    noise.stop(t + noiseDur);

    // Low thud
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    osc.connect(oscGain).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  private playCharge(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.35, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  private playDefeat(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.7);
  }

  private playTakbir(ctx: AudioContext): void {
    // Chord: root, fifth, octave with a slight pitch bend evoking a chant burst
    const t = ctx.currentTime;
    const root = 220;
    const partials = [root, root * 1.5, root * 2];
    for (const f of partials) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f * 0.95, t);
      osc.frequency.linearRampToValueAtTime(f, t + 0.15);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.1);
      g.gain.linearRampToValueAtTime(0.18, t + 0.5);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      osc.connect(g).connect(this.master!);
      osc.start(t);
      osc.stop(t + 1.0);
    }
  }

  private playHorn(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.value = 165; // E3-ish
    osc2.frequency.value = 220; // A3-ish
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.08);
    g.gain.linearRampToValueAtTime(0.25, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(g).connect(this.master!);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 1.0);
    osc2.stop(t + 1.0);
  }
}
