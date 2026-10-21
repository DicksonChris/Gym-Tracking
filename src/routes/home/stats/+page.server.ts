import type { PageServerLoad } from './$types';
import { getExercises } from '$lib/api/exercises';
import { getHistories } from '$lib/api/history';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) {
		return { exercises: [], histories: [] };
	}

	const [exercises, histories] = await Promise.all([
		getExercises(locals.pb, user, true),
		getHistories(locals.pb, user)
	]);

	return { exercises, histories };
};
