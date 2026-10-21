import { writable } from 'svelte/store';

export interface RestTimerState {
	startedAt: number;
	endsAt: number;
	exerciseId?: string;
	label?: string;
}

/**
 * Global rest timer. Client-only: never written during SSR, so the
 * module-level store is safe.
 */
export const restTimer = writable<RestTimerState | null>(null);

/** Start a countdown; a non-positive duration means "no timer" for that exercise. */
export function startRestTimer(seconds: number, exerciseId?: string, label?: string) {
	if (seconds <= 0) {
		restTimer.set(null);
		return;
	}
	const now = Date.now();
	restTimer.set({ startedAt: now, endsAt: now + seconds * 1000, exerciseId, label });
}

/** Re-time a running timer for this exercise after its rest setting changes. */
export function retimeRestTimer(exerciseId: string, seconds: number) {
	restTimer.update((t) => {
		if (!t || t.exerciseId !== exerciseId) return t;
		if (seconds <= 0) return null;
		return { ...t, endsAt: t.startedAt + seconds * 1000 };
	});
}

export function extendRestTimer(seconds: number) {
	restTimer.update((t) => (t ? { ...t, endsAt: t.endsAt + seconds * 1000 } : t));
}

export function clearRestTimer() {
	restTimer.set(null);
}
