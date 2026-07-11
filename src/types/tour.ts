export type TourPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface TourAction {
  type: 'click';
  target?: string;
  description: string;
}

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: TourPosition;
  action?: TourAction;
  spotlightPadding?: number;
  disableInteraction?: boolean;
  beforeShow?: () => void | Promise<void>;
  afterShow?: () => void | Promise<void>;
}

export interface TourState {
  isActive: boolean;
  currentStep: number;
}

export interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface TooltipPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  transform?: string;
}
