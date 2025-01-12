import type { PageServerLoad } from './$types';
import { getWorkouts } from '$lib/api/workouts';
import { getExercises } from '$lib/api/exercises';
import { getSelectedWorkouts } from '$lib/api/selectedWorkout';
import { getHistories } from '$lib/api/history';

export const load: PageServerLoad = async () => {
    const [workouts, exercises, selectedWorkouts, histories] = await Promise.all([
        getWorkouts(),
        getExercises(),
        getSelectedWorkouts(),
        getHistories()
    ]);

    // Group histories by exercise ID
    const groupedHistories = histories.reduce((acc, history) => {
        if (!acc[history.exercise]) {
            acc[history.exercise] = [];
        }
        acc[history.exercise].push(history);
        return acc;
    }, {});
    
    return {
        workouts,
        exercises,
        selectedWorkouts,
        histories: groupedHistories
    };
};