import { ensureSuperuserAuth } from '$lib/api/pocketbase';
import { loadAllExercises } from '$lib/stores/exercisesStore';

export const load = async () => {
  await ensureSuperuserAuth();

  try {
    const allExercises = await loadAllExercises();
    return { allExercises };
  } catch (error) {
    console.error('Error loading exercises:', error);
    return { allExercises: [] };
  }
};
