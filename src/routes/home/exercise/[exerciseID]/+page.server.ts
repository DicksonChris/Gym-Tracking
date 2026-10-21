import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getExercise } from '$lib/api/exercises';
import { getHistoriesByExercise } from '$lib/api/history';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) {
		throw redirect(303, '/login');
	}

	const exercise = await getExercise(locals.pb, user, params.exerciseID).catch(() => null);
	if (!exercise) {
		return { exercise: null, histories: [] };
	}

	const histories = await getHistoriesByExercise(locals.pb, user, exercise.id);

	return {
		exercise,
		histories
	};
};
