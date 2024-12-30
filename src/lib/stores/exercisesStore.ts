import { writable } from 'svelte/store';
import { getExercises, type Exercise } from '$lib/api/exercises';

export const exercisesStore = writable<Exercise[] | null>(null);

export async function loadExercises() {
  const current = getStoreValue(exercisesStore);
  if (!current) {
    try {
      const exercises = await getExercises();
      exercisesStore.set(exercises);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  }
}

// Helper function to get store value without subscribing
function getStoreValue<T>(store: import('svelte/store').Readable<T>) {
  let value: T;
  store.subscribe((v) => (value = v))();
  return value;
}