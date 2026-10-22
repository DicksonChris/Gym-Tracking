import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { startSession } from '$lib/api/sessions';

/** Start a session: `{ workout?: string }` — omit workout for a freeform session. */
export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) return json({ error: 'Not authenticated' }, { status: 401 });

	try {
		const body = await request.json().catch(() => ({}));
		const workout = typeof body.workout === 'string' && body.workout ? body.workout : undefined;
		const session = await startSession(locals.pb, user, workout);
		return json(session);
	} catch (err) {
		console.error('Error in POST /api/sessions:', err);
		return json({ error: 'Failed to start workout' }, { status: 400 });
	}
};
