import type { PageLoad } from './$types';
import { setWorkouts } from '$lib/stores/workoutsStore';
import { setExercises } from '$lib/stores/exercisesStore';
import { setSelectedWorkouts } from '$lib/stores/selectedWorkoutsStore';
import { setAllHistories } from '$lib/stores/historiesStore';

export const load: PageLoad = async ({ data }) => {
    setWorkouts(data.workouts);
    setExercises(data.exercises);
    setSelectedWorkouts(data.selectedWorkouts);
    setAllHistories(data.histories);

    return data; 
};