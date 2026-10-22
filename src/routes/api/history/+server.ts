import type { RequestHandler } from './$types';
import { createHistory, getHistoriesByExercise, type History } from '$lib/api/history';
import { addExerciseToSession, getSession } from '$lib/api/sessions';

/**
 * JSON endpoint for logging a set. Used by the on-page logging flow and the
 * offline queue. Returns the created record plus PR detection info.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) {
		return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
	}

	try {
		const body = await request.json();
		const { exercise, reps, weight, distance, time, note, startTime, session } = body;

		if (!exercise || typeof exercise !== 'string') {
			return new Response(JSON.stringify({ error: 'Missing exercise' }), { status: 400 });
		}

		// Link to a session only if it belongs to this user; a stale/foreign id is ignored.
		let sessionId: string | undefined;
		if (typeof session === 'string' && session) {
			sessionId = await getSession(locals.pb, user, session)
				.then((s) => s.id)
				.catch(() => undefined);
		}

		// PR detection: compare against existing bests before inserting.
		const existing = await getHistoriesByExercise(locals.pb, user, exercise);
		const prevBestWeight = Math.max(0, ...existing.map((h) => h.weight ?? 0));
		const prevBestReps = Math.max(0, ...existing.map((h) => h.reps ?? 0));

		const data: Partial<History> = {
			exercise,
			reps: reps ? Number(reps) : undefined,
			weight: weight ? Number(weight) : undefined,
			distance: distance?.toString() || undefined,
			time: time?.toString() || undefined,
			note: note?.toString().slice(0, 500) || undefined,
			// honor a client-provided time for offline-queued sets
			startTime: typeof startTime === 'string' && startTime ? startTime : undefined,
			session: sessionId
		};

		const record = await createHistory(locals.pb, user, data);
		if (sessionId) {
			await addExerciseToSession(locals.pb, user, sessionId, exercise).catch((err) =>
				console.error('Failed to add exercise to session:', err)
			);
		}

		const w = Number(weight) || 0;
		const r = Number(reps) || 0;
		const isWeightPR = w > 0 && w > prevBestWeight;
		// reps PR only meaningful for exercises without weight
		const isRepsPR = w === 0 && r > 0 && prevBestWeight === 0 && r > prevBestReps;

		return new Response(
			JSON.stringify({
				record,
				isPR: isWeightPR || isRepsPR,
				prType: isWeightPR ? 'weight' : isRepsPR ? 'reps' : null,
				prevBest: isWeightPR ? prevBestWeight : isRepsPR ? prevBestReps : null
			}),
			{ status: 200 }
		);
	} catch (err: unknown) {
		console.error('Error in POST /api/history:', err);
		return new Response(JSON.stringify({ error: 'Failed to log set' }), { status: 400 });
	}
};
