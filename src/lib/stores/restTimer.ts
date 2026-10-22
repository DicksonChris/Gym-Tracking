import { writable } from 'svelte/store';
import { REST_MAX, REST_MIN } from '$lib/rest';

export interface RestTimerState {
	startedAt: number;
	endsAt: number;
	/** The exercise's configured rest (what the cog stepper edits). */
	restSeconds: number;
	exerciseId?: string;
}

/**
 * Global rest timer. Client-only: never written during SSR, so the
 * module-level store is safe.
 */
export const restTimer = writable<RestTimerState | null>(null);

/**
 * Rest values changed during this session, keyed by exercise id, so pages
 * holding a stale exercise record pick up the new value immediately.
 */
export const restOverrides = writable<Record<string, number>>({});

/** Start a countdown; a non-positive duration means "no timer" for that exercise. */
export function startRestTimer(seconds: number, exerciseId?: string) {
	if (seconds <= 0) {
		restTimer.set(null);
		return;
	}
	const now = Date.now();
	restTimer.set({ startedAt: now, endsAt: now + seconds * 1000, restSeconds: seconds, exerciseId });
}

export function extendRestTimer(seconds: number) {
	restTimer.update((t) => (t ? { ...t, endsAt: t.endsAt + seconds * 1000 } : t));
}

export function clearRestTimer() {
	restTimer.set(null);
}

let saveTimeout: ReturnType<typeof setTimeout> | undefined;

/** Adjust the running exercise's rest by `delta` seconds and persist it (debounced). */
export function adjustExerciseRest(delta: number) {
	let target: { id: string; seconds: number } | null = null;
	restTimer.update((t) => {
		if (!t) return t;
		const seconds = Math.min(REST_MAX, Math.max(REST_MIN, t.restSeconds + delta));
		const applied = seconds - t.restSeconds;
		if (t.exerciseId) target = { id: t.exerciseId, seconds };
		return { ...t, restSeconds: seconds, endsAt: t.endsAt + applied * 1000 };
	});
	if (!target) return;
	const { id, seconds } = target;
	restOverrides.update((o) => ({ ...o, [id]: seconds }));

	clearTimeout(saveTimeout);
	saveTimeout = setTimeout(async () => {
		try {
			const res = await fetch('/api/exercises', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ id, restSeconds: seconds })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
		} catch (err) {
			console.error('Failed to save rest time:', err);
		}
	}, 600);
}
