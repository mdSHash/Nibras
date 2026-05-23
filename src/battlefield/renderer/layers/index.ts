/**
 * Rendering layers (bottom to top):
 * 0 - Background: terrain, ground texture
 * 1 - Tactical: grid lines, zone highlights, terrain markers
 * 2 - Entity: unit tokens, formation indicators
 * 3 - Effects: arrows, dust, impact effects
 * 4 - UI Overlay: labels, health bars, selection indicators
 */

export const LAYER_NAMES = ['background', 'tactical', 'entity', 'effects', 'ui'] as const;
export type LayerName = (typeof LAYER_NAMES)[number];

export const LAYER_INDICES: Record<LayerName, number> = {
  background: 0,
  tactical: 1,
  entity: 2,
  effects: 3,
  ui: 4,
};
