import { loadAllExercises } from '$lib/stores/exercisesStore';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {

  try {
    let allExercises = await loadAllExercises()
    allExercises = allExercises.filter(exercise => !exercise.hidden)

    return {
      allExercises
    };
  } catch (error) {
    console.error('Error loading workout:', error);
  }
};
