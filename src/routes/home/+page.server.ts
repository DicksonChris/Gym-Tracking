import type { PageServerLoad } from './$types';
import { getWorkouts } from '$lib/api/workouts';
import { getExercises } from '$lib/api/exercises';
import { getSelectedWorkouts } from '$lib/api/selectedWorkouts';
import { getHistories } from '$lib/api/history';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.pb.authStore.record;

    if (!user) {
        return {
            workouts: [],
            exercises: [],
            selectedWorkouts: [],
            histories: {}
        };
    }

    // Fetch user-specific data from PocketBase
    const [workouts, exercises, selectedWorkouts, historiesArr] = await Promise.all([
        getWorkouts(locals.pb, user),
        getExercises(locals.pb, user),
        getSelectedWorkouts(locals.pb, user),
        getHistories(locals.pb, user)
    ]);

    // Group histories by exercise ID if needed
    const histories = historiesArr.reduce<Record<string, any[]>>((acc, item) => {
        if (!acc[item.exercise]) {
            acc[item.exercise] = [];
        }
        acc[item.exercise].push(item);
        return acc;
    }, {});

    return {
        workouts,
        exercises: exercises.map(ex => ({
            ...ex,
            muscleGroup: ex.muscleGroup || ''
        })),
        selectedWorkouts,
        histories
    };
};