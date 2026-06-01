/**
 * BattlePlayer — Main React component for the battle replay viewer.
 *
 * Mounts the PixiJS canvas, initializes the Engine, loads a scenario,
 * and provides playback controls + UI overlays.
 */

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Engine } from '../core/Engine';
import { usePlaybackStore } from '../state/playbackStore';
import { useSimulationStore } from '../state/simulationStore';
import { useUIStore } from '../state/uiStore';
import { getScenario } from '../scenarios/index';
import { FACTION_NAME_AR } from '../types/components';
import type { Faction } from '../types/components';
import type { BattleScenario } from '../types/scenario';
import { AtmosphereOverlay } from './AtmosphereOverlay';

// ─── Props ───────────────────────────────────────────────────────────────────

export interface BattlePlayerProps {
  scenarioId?: string;
  onBack?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

const SPEED_OPTIONS = [0.5, 1, 2, 4] as const;

/** Arabic label for each BattleVerdict on the end-of-battle summary card. */
function verdictLabelAr(verdict: string): string {
  switch (verdict) {
    case 'muslim_victory':       return 'نصر المسلمين';
    case 'enemy_victory':        return 'انتصار العدو';
    case 'tactical_withdrawal':  return 'انسحاب تكتيكي';
    case 'unfought_expedition':  return 'غزوة دون قتال';
    case 'draw':                 return 'تعادل';
    case 'inconclusive':         return 'غير حاسمة';
    default:                     return verdict;
  }
}

/** Tailwind classes for the verdict badge — colored by outcome. */
function cnVerdict(verdict: string): string {
  const base =
    'px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border tabular-nums whitespace-nowrap';
  switch (verdict) {
    case 'muslim_victory':
      return `${base} bg-green-900/40 border-green-500/60 text-green-200`;
    case 'enemy_victory':
      return `${base} bg-red-900/40 border-red-500/60 text-red-200`;
    case 'tactical_withdrawal':
      return `${base} bg-amber-900/40 border-amber-500/60 text-amber-200`;
    case 'unfought_expedition':
      return `${base} bg-blue-900/40 border-blue-500/60 text-blue-200`;
    default:
      return `${base} bg-gray-800/60 border-gray-500/40 text-gray-300`;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BattlePlayer({ scenarioId = 'battle-of-badr', onBack }: BattlePlayerProps) {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scenario, setScenario] = useState<BattleScenario | null>(null);

  // Zustand store selectors (granular subscriptions for performance)
  const status = usePlaybackStore((s) => s.status);
  const currentTime = usePlaybackStore((s) => s.currentTime);
  const totalDuration = usePlaybackStore((s) => s.totalDuration);
  const speed = usePlaybackStore((s) => s.speed);
  const currentPhaseName = usePlaybackStore((s) => s.currentPhaseName);
  const progress = usePlaybackStore((s) => s.progress);

  const muslimStrength = useSimulationStore((s) => s.muslimStrength);
  const enemyStrength = useSimulationStore((s) => s.enemyStrength);

  const narration = useUIStore((s) => s.narration);

  // Determine which factions are participating so we can label badges in Arabic.
  // Defaults to 'muslim' / 'quraysh' until the scenario resolves.
  const factionLabels = useMemo(() => {
    const muslimSideFaction =
      scenario?.forces.find((f) => f.faction === 'mamluk' || f.faction === 'muslim')
        ?.faction ?? 'muslim';
    const enemyFaction =
      scenario?.forces.find(
        (f) => f.faction !== 'muslim' && f.faction !== 'mamluk' && f.faction !== 'neutral'
      )?.faction ?? 'quraysh';
    return {
      muslim: FACTION_NAME_AR[muslimSideFaction as Faction],
      enemy: FACTION_NAME_AR[enemyFaction as Faction],
    };
  }, [scenario]);

  // ─── Engine Lifecycle ────────────────────────────────────────────────────────

  useEffect(() => {
    console.log('[BattlePlayer] useEffect triggered, scenarioId:', scenarioId);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      console.error('[BattlePlayer] canvas or container ref is null!', { canvas: !!canvas, container: !!container });
      return;
    }
    console.log('[BattlePlayer] canvas and container refs OK');

    // Resolve scenario
    console.log('[BattlePlayer] resolving scenario...');
    const loadedScenario = getScenario(scenarioId);
    if (!loadedScenario) {
      console.error('[BattlePlayer] scenario not found:', scenarioId);
      setError(`Scenario "${scenarioId}" not found.`);
      setIsLoading(false);
      return;
    }
    console.log('[BattlePlayer] scenario resolved:', loadedScenario.name);

    setScenario(loadedScenario);

    let destroyed = false;
    let rafId: number | null = null;

    const initEngine = async () => {
      try {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        console.log('[BattlePlayer] container dimensions:', { width, height });

        // Validate canvas dimensions before attempting WebGL init
        if (width === 0 || height === 0) {
          throw new Error(
            'Canvas container has zero dimensions. Ensure the battle player is visible before initializing.'
          );
        }

        console.log('[BattlePlayer] creating Engine...');
        const engine = new Engine();
        engineRef.current = engine;
        console.log('[BattlePlayer] Engine created, calling engine.init()...');

        await engine.init(canvas, width, height);
        console.log('[BattlePlayer] engine.init() resolved!');

        // Dev-only handle so end-to-end capture scripts (Playwright,
        // dev-tools console) can seek the simulation. Stripped in
        // production builds via the import.meta.env.DEV check.
        if (import.meta.env?.DEV && typeof window !== 'undefined') {
          (window as unknown as { __nibrasEngine?: unknown }).__nibrasEngine = engine;
        }

        if (destroyed) {
          console.log('[BattlePlayer] destroyed during init, cleaning up');
          engine.destroy();
          return;
        }

        console.log('[BattlePlayer] loading scenario...');
        engine.loadScenario(loadedScenario);
        console.log('[BattlePlayer] scenario loaded, setting isLoading=false');
        setIsLoading(false);
      } catch (err) {
        console.error('[BattlePlayer] init error caught:', err);
        if (!destroyed) {
          setError(err instanceof Error ? err.message : 'Failed to initialize engine');
          setIsLoading(false);
        }
      }
    };

    // Defer initialization to the next animation frame to ensure the canvas
    // element is fully attached to the DOM and has valid layout dimensions.
    // This prevents PixiJS WebGL context creation from hanging on a canvas
    // that hasn't been painted yet.
    console.log('[BattlePlayer] scheduling init via requestAnimationFrame...');
    rafId = requestAnimationFrame(() => {
      rafId = null;
      console.log('[BattlePlayer] rAF fired, destroyed=', destroyed);
      if (!destroyed) {
        initEngine();
      }
    });

    // Handle resize — also re-fit the camera so a phone rotation doesn't
    // leave the action zoomed off-screen.
    const handleResize = () => {
      if (engineRef.current && container) {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        engineRef.current.resize(width, height);
        engineRef.current.fitToScenario(0.4);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('[BattlePlayer] cleanup running');
      destroyed = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('resize', handleResize);
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      if (import.meta.env?.DEV && typeof window !== 'undefined') {
        try {
          delete (window as unknown as { __nibrasEngine?: unknown }).__nibrasEngine;
        } catch {
          (window as unknown as { __nibrasEngine?: unknown }).__nibrasEngine = undefined;
        }
      }
    };
  }, [scenarioId]);

  // ─── Playback Controls ───────────────────────────────────────────────────────

  const handlePlayPause = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (status === 'playing') {
      engine.pause();
    } else if (status === 'paused' || status === 'completed') {
      if (status === 'completed') {
        engine.seek(0);
      }
      engine.play();
    }
  }, [status]);

  /** Re-fit the camera to the action bounding box. Useful after the user
   *  has pinch-zoomed away or scrolled to inspect a specific corner. */
  const handleFitCamera = useCallback(() => {
    engineRef.current?.fitToScenario(0.5);
  }, []);

  const handleRestart = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.seek(0);
    engine.play();
  }, []);

  const handleSpeedChange = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const currentIndex = SPEED_OPTIONS.indexOf(speed as typeof SPEED_OPTIONS[number]);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    engine.setSpeed(SPEED_OPTIONS[nextIndex]);
  }, [speed]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const engine = engineRef.current;
      if (!engine || totalDuration <= 0) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const fraction = Math.max(0, Math.min(1, x / rect.width));
      const seekTime = fraction * totalDuration;
      engine.seek(seekTime);
    },
    [totalDuration]
  );

  // ─── Mouse Wheel Zoom ──────────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const engine = engineRef.current;
      if (!engine) return;

      const camera = engine.getCamera();
      if (!camera) return;

      const currentZoom = camera.getZoom();
      const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
      const newZoom = Math.max(0.3, Math.min(3.0, currentZoom + zoomDelta));
      camera.zoomTo(newZoom, 0.2);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // ─── Touch: Pinch-to-Zoom + One-Finger Pan ────────────────────────────────
  // Uses Pointer Events so it works on mouse, touch, and pen uniformly.
  // Two pointers → pinch zoom (around the midpoint). One pointer → pan.

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pointers = new Map<number, { x: number; y: number }>();
    let lastPinchDistance = 0;

    const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y);

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore gestures that start on UI overlays — let the buttons handle them.
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-battle-ui]')) return;
      // Mouse should keep using existing wheel zoom; only handle touch/pen here.
      if (e.pointerType === 'mouse') return;

      container.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        const pts = Array.from(pointers.values());
        lastPinchDistance = distance(pts[0], pts[1]);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      const engine = engineRef.current;
      const camera = engine?.getCamera();
      if (!camera) return;

      const prev = pointers.get(e.pointerId)!;
      const next = { x: e.clientX, y: e.clientY };
      pointers.set(e.pointerId, next);

      if (pointers.size === 1) {
        // Pan: convert screen delta to world delta (inverse of zoom)
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const pos = camera.getPosition();
        const z = camera.getZoom();
        camera.setPosition(pos.x - dx / z, pos.y - dy / z);
      } else if (pointers.size === 2) {
        const pts = Array.from(pointers.values());
        const newDistance = distance(pts[0], pts[1]);
        if (lastPinchDistance > 0) {
          const ratio = newDistance / lastPinchDistance;
          const newZoom = Math.max(0.3, Math.min(3.0, camera.getZoom() * ratio));
          camera.setZoom(newZoom);
        }
        lastPinchDistance = newDistance;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      lastPinchDistance = 0;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // already released
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointercancel', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerUp);

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointercancel', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerUp);
    };
  }, []);

  // ─── ESC Key to Close ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!onBack) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  // ─── Error State ─────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white z-50"
        dir="rtl"
        lang="ar"
      >
        <div className="text-center space-y-4 px-6">
          <div className="text-red-400 text-5xl" aria-hidden>⚠️</div>
          <h2 className="text-xl font-semibold">تعذّر تحميل المعركة</h2>
          <p className="text-gray-400 max-w-md mx-auto">{error}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 px-5 py-2 min-h-[44px] bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="رجوع"
            >
              رجوع
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden z-50"
      style={{ touchAction: 'none' }}
    >
      {/* PixiJS Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Atmosphere overlay (day phase + weather effects) */}
      {scenario && (
        <AtmosphereOverlay dayPhase={scenario.dayPhase} weather={scenario.weather} />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-900/90 z-50"
          dir="rtl"
          lang="ar"
        >
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-300 text-lg">جارٍ تحميل المعركة...</p>
          </div>
        </div>
      )}

      {/* Top Bar / Header */}
      {!isLoading && (
        <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none" data-battle-ui>
          <div
            className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-3 bg-gradient-to-b from-gray-900/85 to-transparent"
            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
          >
            {/* Left: Back button + Battle name */}
            <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto min-w-0">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex-shrink-0 w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-gray-800/60 hover:bg-gray-700/80 transition-colors text-gray-300 hover:text-white"
                  aria-label="رجوع"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="min-w-0">
                <h1 className="text-white font-semibold text-base sm:text-lg leading-tight truncate" dir="rtl" lang="ar">
                  {scenario?.nameAr ?? scenario?.name ?? 'معركة'}
                </h1>
                {scenario?.date && (
                  <p className="text-gray-400 text-xs truncate">{scenario.date}</p>
                )}
              </div>
            </div>

            {/* Right: Faction Strength Indicators (compact on mobile, full on desktop) */}
            <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-900/80 ring-1 ring-white/10 rounded-lg px-2 sm:px-3 py-1.5" dir="rtl" lang="ar">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                <span className="text-green-400 text-sm font-medium tabular-nums">
                  {muslimStrength.toLocaleString('ar-EG')}
                </span>
                <span className="hidden sm:inline text-gray-100 text-xs">{factionLabels.muslim}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-900/80 ring-1 ring-white/10 rounded-lg px-2 sm:px-3 py-1.5" dir="rtl" lang="ar">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                <span className="text-red-400 text-sm font-medium tabular-nums">
                  {enemyStrength.toLocaleString('ar-EG')}
                </span>
                <span className="hidden sm:inline text-gray-100 text-xs">{factionLabels.enemy}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase Info Display (top-left, below header) */}
      {!isLoading && currentPhaseName && (
        <div className="absolute top-20 sm:top-16 right-3 sm:right-4 z-20 pointer-events-none">
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50 max-w-[60vw] sm:max-w-none">
            <p className="text-gray-200 text-xs" dir="rtl" lang="ar">المرحلة</p>
            <p className="text-white text-sm font-medium truncate" dir="rtl" lang="ar">{currentPhaseName}</p>
            <p className="text-gray-500 text-xs mt-0.5 tabular-nums">{formatTime(currentTime)}</p>
          </div>
        </div>
      )}

      {/* Day counter (only for battles with time compression — Khandaq=27d, etc.) */}
      {!isLoading && scenario?.actualDayCount && totalDuration > 0 && (
        <div className="absolute top-20 sm:top-16 left-3 sm:left-4 z-20 pointer-events-none" dir="rtl" lang="ar">
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-700/40">
            <p className="text-amber-400/80 text-xs tracking-wider">اليوم</p>
            <p className="text-white text-sm font-bold tabular-nums">
              {Math.min(
                scenario.actualDayCount,
                Math.max(1, Math.ceil((currentTime / totalDuration) * scenario.actualDayCount))
              )}
              <span className="text-gray-500 mx-1">/</span>
              <span className="text-gray-400">{scenario.actualDayCount}</span>
            </p>
          </div>
        </div>
      )}

      {/* Narration Overlay (Arabic only) */}
      {!isLoading && narration && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-2xl px-4">
          <div
            className={`bg-gray-900/85 backdrop-blur-md rounded-xl px-6 py-4 border border-gray-600/30 animate-fade-in ${
              narration.style === 'dramatic' ? 'border-amber-500/40' : ''
            } ${narration.style === 'quote' ? 'border-green-500/30 italic' : ''}`}
          >
            {/* Arabic narration text (RTL) */}
            <p
              className="text-gray-100 text-center text-lg leading-relaxed"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: "'Noto Sans Arabic', 'Segoe UI', 'Tahoma', sans-serif" }}
            >
              {narration.textAr || narration.text}
            </p>
          </div>
        </div>
      )}

      {/* End-of-battle summary panel (when status === 'completed') */}
      {!isLoading && status === 'completed' && scenario && (
        <div
          className="absolute inset-0 flex items-center justify-center z-40 bg-black/65 overflow-y-auto py-6 px-3"
          dir="rtl"
          lang="ar"
        >
          <div className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-md border border-amber-700/40 rounded-2xl shadow-2xl p-5 sm:p-7 space-y-5">
            {/* Verdict badge */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-amber-300 text-xl sm:text-2xl font-bold">
                {scenario.nameAr}
              </h2>
              <span
                className={cnVerdict(scenario.outcome.verdict)}
                aria-label="نتيجة المعركة"
              >
                {verdictLabelAr(scenario.outcome.verdict)}
              </span>
            </div>

            {/* Casualties grid — survivors take green, fallen take faction-red */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/70 rounded-xl p-3 border border-green-700/40">
                <p className="text-gray-400 text-xs">خسائر المسلمين</p>
                <p className="text-green-300 text-2xl sm:text-3xl font-bold tabular-nums">
                  {scenario.outcome.muslimCasualties.toLocaleString('ar-EG')}
                </p>
                <p className="text-gray-500 text-[11px] mt-0.5">شهيداً</p>
              </div>
              <div className="bg-gray-800/70 rounded-xl p-3 border border-red-700/40">
                <p className="text-gray-400 text-xs">خسائر العدو</p>
                <p className="text-red-300 text-2xl sm:text-3xl font-bold tabular-nums">
                  {scenario.outcome.enemyCasualties !== undefined
                    ? scenario.outcome.enemyCasualties.toLocaleString('ar-EG')
                    : '—'}
                </p>
                <p className="text-gray-500 text-[11px] mt-0.5">قتيلاً</p>
              </div>
            </div>

            {/* Summary paragraph */}
            <div className="bg-gray-800/40 rounded-xl p-3 sm:p-4 border border-gray-700/40">
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                {scenario.outcome.summaryAr || scenario.outcome.summary}
              </p>
            </div>

            {/* Significance — historical importance, Arabic only.
             *  Falls back to English `significance` only if no Arabic
             *  text was authored. */}
            {(scenario.outcome.significanceAr || scenario.outcome.significance) && (
              <div className="border-r-2 border-amber-600/60 pr-3">
                <p className="text-amber-200/90 text-xs sm:text-sm leading-relaxed">
                  {scenario.outcome.significanceAr || scenario.outcome.significance}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap justify-center pt-2">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-600/60 text-white font-semibold"
                aria-label="إعادة المعركة"
              >
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 1 9 9M3 12V3m0 9h9" />
                </svg>
                <span>إعادة المعركة</span>
              </button>

              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gray-800 hover:bg-red-900/40 transition-colors border border-red-700/40 text-white font-semibold"
                  aria-label="خروج"
                >
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>خروج</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legacy fallback kept hidden — old replay overlay (never renders;
          the summary panel above always wins when scenario is present). */}
      {false && !isLoading && status === 'completed' && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/40" dir="rtl" lang="ar">
          <div className="flex items-center gap-4 flex-wrap justify-center px-4">
            <button
              onClick={handleRestart}
              className="flex flex-col items-center gap-3 px-6 sm:px-8 py-5 sm:py-6 rounded-2xl bg-gray-900/90 backdrop-blur-md border border-gray-600/50 hover:bg-gray-800/90 transition-colors group min-h-[44px]"
              aria-label="إعادة المعركة"
            >
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 group-hover:text-green-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 1 9 9M3 12V3m0 9h9" />
              </svg>
              <span className="text-white text-lg font-semibold">إعادة المعركة</span>
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="flex flex-col items-center gap-3 px-6 sm:px-8 py-5 sm:py-6 rounded-2xl bg-gray-900/90 backdrop-blur-md border border-red-600/40 hover:bg-red-900/40 transition-colors group min-h-[44px]"
                aria-label="خروج"
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 group-hover:text-red-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-white text-lg font-semibold">خروج</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Playback Controls Bar (bottom) */}
      {!isLoading && (
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none" data-battle-ui>
          <div
            className="px-3 sm:px-4 pt-8 bg-gradient-to-t from-gray-900/95 to-transparent"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pointer-events-auto">
              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                className="flex-shrink-0 w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors text-white border border-gray-600/50"
                aria-label={status === 'playing' ? 'إيقاف' : 'تشغيل'}
              >
                {status === 'playing' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Restart Button */}
              <button
                onClick={handleRestart}
                className="flex-shrink-0 w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors text-white border border-gray-600/50"
                aria-label="إعادة من البداية"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 1 9 9M3 12V3m0 9h9" />
                </svg>
              </button>

              {/* Time Display */}
              <span className="text-gray-300 text-xs font-mono tabular-nums min-w-[78px] sm:min-w-[80px]">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>

              {/* Fit-to-action button — re-centers the camera */}
              <button
                onClick={handleFitCamera}
                className="flex-shrink-0 w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors text-white border border-gray-600/50"
                aria-label="إعادة ضبط العرض"
                title="إعادة ضبط العرض"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>

              {/* Speed Control */}
              <button
                onClick={handleSpeedChange}
                className="flex-shrink-0 px-3 py-1.5 min-h-[40px] rounded-lg bg-gray-800/80 hover:bg-gray-700 transition-colors text-gray-300 text-xs font-medium border border-gray-600/50"
                aria-label="تغيير السرعة"
              >
                {speed}x
              </button>

              {/* Phase name (compact, Arabic) — hidden on small screens */}
              {currentPhaseName && (
                <span className="hidden md:inline text-gray-500 text-xs truncate max-w-[150px]" dir="rtl" lang="ar">
                  {currentPhaseName}
                </span>
              )}

              {/* Progress/Seek Bar — wraps to its own row on mobile */}
              <div
                className="basis-full order-last sm:basis-auto sm:flex-1 sm:order-none h-3 sm:h-2 bg-gray-700/80 rounded-full cursor-pointer relative group"
                onClick={handleSeek}
                role="slider"
                aria-label="شريط التقدم"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-green-500/80 rounded-full transition-[width] duration-100"
                  style={{ width: `${progress * 100}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress * 100}% - 6px)` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
