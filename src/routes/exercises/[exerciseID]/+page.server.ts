import type { PageServerLoad } from './$types';
import { getExercise } from '$lib/api/exercises';
import type { Exercise } from '$lib/api/exercises';
import { getMuscleGroups } from '$lib/api/somewhere'; // or define your approach

export const load: PageServerLoad = async ({ params, locals }) => {
    const user = locals.pb.authStore.record;
    const exerciseID = params.exerciseID;

    // If not logged in, return minimal data
    if (!user) {
        return {
            exerciseID,
            exercise: null,
            muscleGroups: []
        };
    }

    // SSR load muscle groups (replace with your actual function or logic)
    const muscleGroups = await getMuscleGroups(locals.pb, user);

    // If new exercise
    if (exerciseID === 'new') {
        return {
            exerciseID,
            exercise: null,
            muscleGroups
        };
    }

    // Otherwise fetch existing exercise
    try {
        const exercise = await getExercise(locals.pb, user, exerciseID);

        if (!exercise) {
            throw new Error('Exercise not found');
        }

        return {
            exerciseID,
            exercise,
            muscleGroups
        };
    } catch (error) {
        console.error('Error loading exercise:', error);
        return {
            exerciseID,
            exercise: null,
            muscleGroups
        };
    }
};