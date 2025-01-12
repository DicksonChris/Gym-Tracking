import type { PageLoad } from './$types';
import { workoutsStore } from '$lib/stores/workoutsStore';
import { exercisesStore } from '$lib/stores/exercisesStore';
import { selectedWorkoutsStore } from '$lib/stores/selectedWorkoutsStore';
import { historiesStore } from '$lib/stores/historiesStore';

export const load: PageLoad = async ({ data }) => {
    workoutsStore.set(data.workouts);
    exercisesStore.set(data.exercises.map(ex => ({
        ...ex,
        muscleGroup: ex.muscleGroup || ''
    })));
    selectedWorkoutsStore.set(data.selectedWorkouts);
    historiesStore.set(data.histories);
    
    return data;
};