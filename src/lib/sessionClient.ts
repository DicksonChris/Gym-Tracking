import { goto } from '$app/navigation';

/** Start a routine (workoutId) or freeform session, then open the session screen. */
export async function startWorkout(workoutId?: string) {
	const res = await fetch('/api/sessions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ workout: workoutId })
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	await goto('/home/today', { invalidateAll: true });
}

/** h:mm:ss (or m:ss under an hour). */
export function fmtElapsed(ms: number): string {
	const total = Math.max(0, Math.floor(ms / 1000));
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = total % 60;
	const ss = String(s).padStart(2, '0');
	return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

/** Human duration, e.g. "52 min" or "1 h 05 min". */
export function fmtDurationLong(ms: number): string {
	const mins = Math.max(0, Math.round(ms / 60000));
	if (mins < 60) return `${mins} min`;
	return `${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, '0')} min`;
}
