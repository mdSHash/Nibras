import type { EventItem } from '../../data';

/** One era chip: the label, its dot color, and the anchor event to jump to. */
export interface QuickJump {
  label: string;
  color: string;
  target: EventItem | undefined;
}

/** Props both docks (mobile + desktop) consume identically. */
export interface DockProps {
  isDockVisible: boolean;
  setIsDockVisible: (v: boolean) => void;
  isPlayerMode: boolean;
  isAutoPlaying: boolean;
  isTTSEnabled: boolean;
  playbackSpeed: 1 | 2 | 3;
  selectedEra: string | null | undefined;
  quickJumps: QuickJump[];
  onToggleAutoPlay: () => void;
  onToggleTTS: () => void;
  onCycleSpeed: () => void;
  onStartOver: () => void;
  onExitPlayerMode: () => void;
  onEraClick: (label: string) => void;
}
