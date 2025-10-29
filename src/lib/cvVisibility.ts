// Utility to read and validate CV visibility mode
// Allowed values: 'hidden', 'shareable', 'public'
// Fallback: 'shareable' when invalid or undefined
export type CVVisibilityMode = 'hidden' | 'shareable' | 'public';

const ALLOWED: Set<CVVisibilityMode> = new Set(['hidden', 'shareable', 'public']);

export function getCvVisibility(raw: string | undefined): CVVisibilityMode {
  if (!raw) return 'shareable';
  if (ALLOWED.has(raw as CVVisibilityMode)) return raw as CVVisibilityMode;
  // Log a warning during build/dev (ignored in static output)
  console.warn(`[cvVisibility] Invalid CV_VISIBILITY value: '${raw}'. Falling back to 'shareable'.`);
  return 'shareable';
}
