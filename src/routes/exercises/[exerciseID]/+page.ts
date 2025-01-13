import { ensureSuperuserAuth } from '$lib/api/pocketbase';
import { loadMuscleGroups, loadExercise } from '$lib/stores/exercisesStore';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    await ensureSuperuserAuth();
    
    const { exerciseID } = params;

    const muscleGroups = await loadMuscleGroups();

    if (exerciseID === 'new') {
        return {
            exerciseID,
            exercise: null,
            muscleGroups
        };
    }

    try {
        const exercise = await loadExercise(exerciseID);

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
            exercise: null,
            muscleGroups
        };
    }
};