import { loadAllExercises } from '$lib/stores/exercisesStore';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {

  try {
    const allExercises = await loadAllExercises()

    return {
      allExercises
    };
  } catch (error) {
    console.error('Error loading workout:', error);
  }
};
