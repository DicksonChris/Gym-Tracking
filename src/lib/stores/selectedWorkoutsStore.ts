import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { saveSelectedWorkouts } from '$lib/api/selectedWorkout';

export const selectedWorkoutsStore = writable<string[]>([]);

// Subscribe to changes and sync to both storages
selectedWorkoutsStore.subscribe(value => {
    if (browser) {
        localStorage.setItem('selectedWorkouts', JSON.stringify(value));
        saveSelectedWorkouts(value).catch(console.error);
    }
});