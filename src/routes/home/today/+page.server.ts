import type { PageServerLoad } from './$types';
import { getWorkouts } from '$lib/api/workouts';
import { getExercises } from '$lib/api/exercises';
import { getSelectedWorkouts } from '$lib/api/selectedWorkouts';
import { getHistories } from '$lib/api/history';
import type { History } from '$lib/api/history';
import { getRecentSessions } from '$lib/api/sessions';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.pb.authStore.record;
	if (!user) {
		return {
			workouts: [],
			exercises: [],
			selectedWorkouts: [],
			histories: {},
			recentSessions: []
		};
	}

	const [{ activeSession }, workouts, exercises, selectedWorkouts, historiesArr] =
		await Promise.all([
			parent(),
			getWorkouts(locals.pb, user),
			getExercises(locals.pb, user, true),
			getSelectedWorkouts(locals.pb, user),
			getHistories(locals.pb, user)
		]);

	const histories = historiesArr.reduce<Record<string, History[]>>((acc, item) => {
		(acc[item.exercise] ??= []).push(item);
		return acc;
	}, {});

	// past workouts are only shown when nothing is in progress
	const recentSessions = activeSession ? [] : await getRecentSessions(locals.pb, user, 10);

	return { workouts, exercises, selectedWorkouts, histories, recentSessions };
};
