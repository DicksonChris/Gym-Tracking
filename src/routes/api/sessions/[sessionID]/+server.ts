import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addExerciseToSession, discardSession, finishSession } from '$lib/api/sessions';

/**
 * Session actions:
 *   { action: 'addExercise', exercise }  — append an exercise
 *   { action: 'finish', note? }          — end the session
 */
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) return json({ error: 'Not authenticated' }, { status: 401 });

	try {
		const body = await request.json();
		if (body.action === 'addExercise' && typeof body.exercise === 'string') {
			return json(await addExerciseToSession(locals.pb, user, params.sessionID, body.exercise));
		}
		if (body.action === 'finish') {
			const note = typeof body.note === 'string' ? body.note : undefined;
			return json(await finishSession(locals.pb, user, params.sessionID, note));
		}
		return json({ error: 'Unknown action' }, { status: 400 });
	} catch (err) {
		console.error('Error in POST /api/sessions/[id]:', err);
		return json({ error: 'Session update failed' }, { status: 400 });
	}
};

/** Discard a session and the sets logged in it. */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) return json({ error: 'Not authenticated' }, { status: 401 });

	try {
		await discardSession(locals.pb, user, params.sessionID);
		return json({ ok: true });
	} catch (err) {
		console.error('Error in DELETE /api/sessions/[id]:', err);
		return json({ error: 'Failed to discard workout' }, { status: 400 });
	}
};
