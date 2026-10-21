import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Global rest timer. Client-only: never written during SSR, so the
 * module-level store is safe.
 */
export const restTimer = writable<{ endsAt: number } | null>(null);

const DURATION_KEY = 'restDuration';
export const REST_PRESETS = [60, 90, 120, 180];

export function getRestDuration(): number {
	if (!browser) return 90;
	const v = parseInt(localStorage.getItem(DURATION_KEY) ?? '90', 10);
	return Number.isFinite(v) && v > 0 ? v : 90;
}

export function setRestDuration(seconds: number) {
	if (browser) localStorage.setItem(DURATION_KEY, String(seconds));
}

export function startRestTimer(seconds = getRestDuration()) {
	restTimer.set({ endsAt: Date.now() + seconds * 1000 });
}

export function extendRestTimer(seconds: number) {
	restTimer.update((t) => (t ? { endsAt: t.endsAt + seconds * 1000 } : t));
}

export function clearRestTimer() {
	restTimer.set(null);
}
