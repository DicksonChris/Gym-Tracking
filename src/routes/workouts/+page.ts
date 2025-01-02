import { loadWorkouts } from '$lib/stores/workoutsStore';
import { loadAllExercises } from '$lib/stores/exercisesStore';

export const load = async () => {

  try {
    const allExercises = await loadAllExercises()

    return {
      allExercises
    };
  } catch (error) {
    console.error('Error loading workout:', error);
  }
};