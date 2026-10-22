import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getExercise } from '$lib/api/exercises';
import { getHistoriesByExercise } from '$lib/api/history';

export const load: PageServerLoad = async ({ params, locals, parent }) => {
	const user = locals.pb.authStore.record;
	if (!user) {
		throw redirect(303, '/login');
	}

	const exercise = await getExercise(locals.pb, user, params.exerciseID).catch(() => null);
	if (!exercise) {
		return { exercise: null, histories: [], nextExercise: null };
	}

	const [histories, { activeSession }] = await Promise.all([
		getHistoriesByExercise(locals.pb, user, exercise.id),
		parent()
	]);

	// next exercise in the active session's order, for one-tap advancing
	let nextExercise: { id: string; name: string } | null = null;
	const order = activeSession?.exercises ?? [];
	const idx = order.indexOf(exercise.id);
	if (idx !== -1 && idx < order.length - 1) {
		const next = await getExercise(locals.pb, user, order[idx + 1], true).catch(() => null);
		if (next) nextExercise = { id: next.id, name: next.name };
	}

	return {
		exercise,
		histories,
		nextExercise
	};
};
