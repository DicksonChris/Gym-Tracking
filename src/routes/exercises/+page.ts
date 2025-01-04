import { loadAllExercises } from '$lib/stores/exercisesStore';
// import type { PageServerLoad } from './$types';

export const load = async () => {
  try {
    const allExercises = await loadAllExercises();
    return { allExercises };
  } catch (error) {
    console.error('Error loading exercises:', error);
    return { allExercises: [] };
  }
};
