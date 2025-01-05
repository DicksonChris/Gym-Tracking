import { loadWorkout, loadWorkoutExercises } from '$lib/stores/workoutsStore';
import { loadAllExercises } from '$lib/stores/exercisesStore';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const { workoutID } = params;

    if (workoutID === 'new') {
        try {
            let allExercises = await loadAllExercises();
            allExercises = allExercises.filter(exercise => !exercise.hidden);
            allExercises.sort((a, b) => a.name.localeCompare(b.name));
            return {
                workoutID,
                workout: { groupName: '', exercises: [] },
                workoutExercises: [],
                allExercises
            };
        } catch (error) {
            console.error('Error loading workout:', error);
            return {
                workout: null
            };
        }
    }

    try {
        const workout = await loadWorkout(workoutID);
        // Filter hidden exercises here
        let workoutExercises = await loadWorkoutExercises(workoutID);
        workoutExercises = workoutExercises.filter(ex => !ex.hidden);

        let allExercises = await loadAllExercises();
        allExercises = allExercises.filter(exercise => !exercise.hidden);
        allExercises.sort((a, b) => a.name.localeCompare(b.name));
        const workoutIds = new Set(workoutExercises.map(x => x.id));
        allExercises = allExercises.filter(x => !workoutIds.has(x.id));

        return {
            workoutID,
            workout,
            workoutExercises,
            allExercises
        };
    } catch (error) {
        console.error('Error loading workout:', error);
        return {
            workout: null
        };
    }
};
