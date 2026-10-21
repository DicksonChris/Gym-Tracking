import type { PageServerLoad } from './$types';
import { getWorkouts } from '$lib/api/workouts';
import { getExercises } from '$lib/api/exercises';
import { getSelectedWorkouts } from '$lib/api/selectedWorkouts';
import { getHistories } from '$lib/api/history';
import type { History } from '$lib/api/history';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) {
		return { workouts: [], exercises: [], selectedWorkouts: [], histories: {} };
	}

	const [workouts, exercises, selectedWorkouts, historiesArr] = await Promise.all([
		getWorkouts(locals.pb, user),
		getExercises(locals.pb, user),
		getSelectedWorkouts(locals.pb, user),
		getHistories(locals.pb, user)
	]);

	const histories = historiesArr.reduce<Record<string, History[]>>((acc, item) => {
		(acc[item.exercise] ??= []).push(item);
		return acc;
	}, {});

	return { workouts, exercises, selectedWorkouts, histories };
};
