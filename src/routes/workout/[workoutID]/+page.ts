import { getWorkout } from '$lib/api/workouts';

export const load = async ({ params }) => {
  const { workoutID } = params;

  try {
    const workout = await getWorkout(workoutID);
    return {
      workout
    };
  } catch (error) {
    console.error('Error loading workout:', error);

    return {
      workout: null
    };
  }
};