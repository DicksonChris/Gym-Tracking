import { writable } from 'svelte/store';
import { getHistoriesByExercise, type History } from '$lib/api/history';

export const historiesStore = writable<Record<string, History[]>>({});

export async function loadHistories(exerciseID: string) {
  const currentHistories = getStoreValue(historiesStore)[exerciseID];
  if (!currentHistories) {
    try {
      const histories = await getHistoriesByExercise(exerciseID);
      historiesStore.update(store => ({
        ...store,
        [exerciseID]: histories.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      }));
    } catch (error) {
      console.error('Error loading histories:', error);
    }
  }
}

// Helper function to get store value without subscribing
function getStoreValue<T>(store: import('svelte/store').Readable<T>) {
  let value: T;
  store.subscribe((v) => (value = v))();
  return value;
}