// src/lib/stores/workoutsStore.ts
import { writable, get } from 'svelte/store';
import { getWorkouts, type Workout } from '$lib/api/workouts';

export const workoutsStore = writable<Workout[] | null>(null);

export async function loadWorkouts() {
  
  if (!get(workoutsStore)) {
    const workouts = await getWorkouts();
    workoutsStore.set(workouts);
  }
}