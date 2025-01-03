import { writable, get } from 'svelte/store';
import { getExercise, type Exercise } from '$lib/api/exercises';
import { getWorkouts, getWorkout, createWorkout, deleteWorkout, updateWorkout, type Workout } from '$lib/api/workouts';

export const workoutsStore = writable<Workout[] | null>(null);

export async function loadWorkouts() {
  
  if (!get(workoutsStore)) {
    const workouts = await getWorkouts();
    workoutsStore.set(workouts);
  }
}

export async function loadWorkout(id: string) {
  const workout = await getWorkout(id);
  return workout;
}

export async function loadWorkoutExercises(workoutID: string): Promise<Exercise[]> {
  const workout = await getWorkout(workoutID);
  if (!workout.exercises) {
    return [];
  }
  return await Promise.all(workout.exercises.map(e => getExercise(e)));
}

export async function createNewWorkout(data: Partial<Workout>) {
  const record = await createWorkout(data);
  const workout: Workout = {
    id: record.id,
    groupName: record.groupName,
    exercises: record.exercises || []
  };
  const workouts = get(workoutsStore);
  if (!workouts) {
    return;
  }
  workouts.push(workout);
  workoutsStore.set(workouts);
}



export async function removeWorkout(id: string) {
  await deleteWorkout(id);
  const workouts = get(workoutsStore);
  if (!workouts) {
    return;
  }
  const index = workouts.findIndex(w => w.id === id);
  workouts.splice(index, 1);
  workoutsStore.set(workouts);
}

export async function saveWorkout(id: string, data: Partial<Workout>) {
  const workout = await updateWorkout(id, data);
  const workouts = get(workoutsStore);
  if (!workouts) {
    return;
  }
  const index = workouts.findIndex(w => w.id === id);
  workouts[index] = workout;
  workoutsStore.set(workouts);
}