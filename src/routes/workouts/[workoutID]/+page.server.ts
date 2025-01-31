// src/routes/workouts/[workoutID]/+page.server.ts
import type { PageServerLoad } from './$types';
import { getWorkout } from '$lib/api/workouts';
import { getExercises } from '$lib/api/exercises';

export const load: PageServerLoad = async ({ params, locals }) => {
    const user = locals.pb.authStore.record;
    const workoutID = params.workoutID;

    // If not logged in, return minimal data
    if (!user) {
        return {
            workoutID,
            workout: null,
            workoutExercises: [],
            allExercises: []
        };
    }

    // For a "new" workout (create mode)
    if (workoutID === 'new') {
        // 1) fetch all exercises
        let allExercises = await getExercises(locals.pb, user, true);
        // filter out hidden
        allExercises = allExercises.filter((exercise) => !exercise.hidden);
        // sort by name
        allExercises.sort((a, b) => a.name.localeCompare(b.name));

        // return empty workout
        return {
            workoutID,
            workout: {
                id: 'temp',      // temporary ID
                groupName: '',
                exercises: []
            },
            workoutExercises: [],
            allExercises
        };
    }

    try {
        // 1) fetch the existing workout
        const workout = await getWorkout(locals.pb, user, workoutID);

        // 2) fetch all exercises for user
        let allExercises = await getExercises(locals.pb, user, true);
        allExercises = allExercises.filter((ex) => !ex.hidden);
        allExercises.sort((a, b) => a.name.localeCompare(b.name));

        // 3) gather the exercise records that belong to the workout
        const workoutExercises = allExercises.filter((ex) =>
            workout.exercises?.includes(ex.id)
        );

        // 4) remove them from the main list (so the "Available" list doesn't have duplicates)
        const workoutIds = new Set(workoutExercises.map((x) => x.id));
        const filteredAll = allExercises.filter((x) => !workoutIds.has(x.id));

        return {
            workoutID,
            workout,
            workoutExercises,
            allExercises: filteredAll
        };
    } catch (error) {
        console.error('Error loading workout:', error);
        return {
            workoutID,
            workout: null,
            workoutExercises: [],
            allExercises: []
        };
    }
};
