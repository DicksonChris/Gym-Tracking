import { getWorkouts, type Workout } from '$lib/api/workouts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const workouts: Workout[] = await getWorkouts();
  return {
    workouts
  };
};