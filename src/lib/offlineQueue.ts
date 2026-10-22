import { browser } from '$app/environment';

/**
 * Offline queue for logged sets. When /api/history is unreachable, sets are
 * stored in localStorage and flushed when connectivity returns.
 */

const KEY = 'pendingSets';

export interface PendingSet {
	exercise: string;
	reps?: number;
	weight?: number;
	distance?: string;
	time?: string;
	note?: string;
	session?: string;
	startTime: string;
}

export function getPending(): PendingSet[] {
	if (!browser) return [];
	try {
		return JSON.parse(localStorage.getItem(KEY) ?? '[]');
	} catch {
		return [];
	}
}

export function queueSet(set: PendingSet) {
	const pending = getPending();
	pending.push(set);
	localStorage.setItem(KEY, JSON.stringify(pending));
}

export function pendingCount(): number {
	return getPending().length;
}

let flushing = false;

/** Try to send all queued sets. Stops at the first failure. */
export async function flushQueue(): Promise<number> {
	if (!browser || flushing) return 0;
	flushing = true;
	let sent = 0;
	try {
		let pending = getPending();
		while (pending.length > 0) {
			const res = await fetch('/api/history', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(pending[0])
			});
			if (!res.ok && res.status !== 400) break; // retry later (but drop permanently-invalid sets)
			pending = pending.slice(1);
			localStorage.setItem(KEY, JSON.stringify(pending));
			sent++;
		}
	} catch {
		// still offline — leave the queue intact
	} finally {
		flushing = false;
	}
	return sent;
}
