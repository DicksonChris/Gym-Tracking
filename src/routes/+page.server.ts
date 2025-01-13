import type { PageServerLoad } from './$types';
import { ensureSuperuserAuth } from '$lib/api/pocketbase';
import { getWorkouts } from '$lib/api/workouts';
import { getExercises } from '$lib/api/exercises';
import { getSelectedWorkouts } from '$lib/api/selectedWorkouts';
import { getHistories } from '$lib/api/history';

export const load: PageServerLoad = async () => {
    try {
        // Wait for superuser auth first
        await ensureSuperuserAuth();

        const [workouts, exercises, selectedWorkouts, histories] = await Promise.all([
            getWorkouts(),
            getExercises(),
            getSelectedWorkouts(),
            getHistories()
        ]);

        // Group histories by exercise ID
        const groupedHistories = histories.reduce<Record<string, History[]>>((acc, history) => {
            if (!acc[history.exercise]) {
                acc[history.exercise] = [];
            }
            acc[history.exercise].push(history);
            return acc;
        }, {});

        return {
            workouts,
            exercises: exercises.map(ex => ({
                ...ex,
                muscleGroup: ex.muscleGroup || ''
            })),
            selectedWorkouts,
            histories: groupedHistories
        };
    } catch (error) {
        console.error('Error during server-side load:', error);
        return {
            workouts: [],
            exercises: [],
            selectedWorkouts: [],
            histories: {}
        };
    }
};