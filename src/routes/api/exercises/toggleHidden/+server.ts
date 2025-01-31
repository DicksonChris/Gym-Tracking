import type { RequestHandler } from './$types';
import { updateExercise } from '$lib/api/exercises';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) {
		return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
	}

	try {
		const { id, hidden } = await request.json();
		if (!id || typeof hidden !== 'boolean') {
			return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
		}

		const updated = await updateExercise(locals.pb, user, id, { hidden });
		return new Response(JSON.stringify(updated), { status: 200 });
	} catch (err: any) {
		console.error('Error toggling hidden status:', err);
		return new Response(JSON.stringify({ error: err.message }), { status: 400 });
	}
};