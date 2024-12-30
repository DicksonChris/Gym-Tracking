import { getWorkouts, type Workout } from '$lib/api/workouts';

export const load = async () => {
  const workouts: Workout[] = await getWorkouts();
  return {
    workouts
  };
};