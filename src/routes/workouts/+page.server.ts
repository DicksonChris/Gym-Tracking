import type { PageServerLoad } from './$types';
import { getExercises } from '$lib/api/exercises';
import { getWorkouts } from '$lib/api/workouts';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.pb.authStore.record;
    if (!user) {
        return { allExercises: [], workouts: [] };
    }

    // SSR fetch for user-based exercises and workouts
    let exercises = await getExercises(locals.pb, user, true); // showHidden = true if desired
    // Filter out hidden if you don't want them
    exercises = exercises.filter((ex) => !ex.hidden);

    const workouts = await getWorkouts(locals.pb, user);

    return {
        allExercises: exercises,
        workouts
    };
};
