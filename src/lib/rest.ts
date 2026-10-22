/**
 * Per-exercise rest durations.
 * Stored on exercises.restSeconds: > 0 = seconds, -1 = no timer,
 * 0/unset = DEFAULT_REST.
 */
export const DEFAULT_REST = 90;
export const REST_OFF = -1;
export const REST_MIN = 15;
export const REST_MAX = 600;
export const REST_STEP = 15;

/** Normalize a stored value into the effective setting (seconds or REST_OFF). */
export function effectiveRest(restSeconds: number | null | undefined): number {
	if (restSeconds == null || restSeconds === 0) return DEFAULT_REST;
	return restSeconds < 0 ? REST_OFF : restSeconds;
}

export function fmtDuration(s: number): string {
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Validate a client-supplied value; returns undefined when invalid. */
export function parseRestSeconds(v: unknown): number | undefined {
	if (typeof v !== 'number' || !Number.isInteger(v)) return undefined;
	if (v === REST_OFF || v === 0 || (v >= REST_MIN && v <= REST_MAX)) return v;
	return undefined;
}
