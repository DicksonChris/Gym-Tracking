import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * A store tracking which workout IDs the user has 'selected'.
 */
export const selectedWorkoutsStore = writable<string[]>([]);

/**
 * Overwrite the current selected workout IDs.
 */
export function setSelectedWorkouts(workouts: string[]) {
    selectedWorkoutsStore.set(workouts);
}

/**
 * Toggle a single workout ID in the store.
 */
export function toggleSelectedWorkout(workoutId: string) {
    selectedWorkoutsStore.update((current) => {
        if (current.includes(workoutId)) {
            return current.filter((id) => id !== workoutId);
        } else {
            return [...current, workoutId];
        }
    });
}

// ----- SYNC CHANGES TO THE SERVER -----

if (browser) {
    selectedWorkoutsStore.subscribe(async (value) => {
        // Each time the array changes on the client, POST to /api/selectedWorkouts
        try {
            await fetch('/api/selectedWorkouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify({ workouts: value })
            });
            // You could handle success or further feedback here if needed
        } catch (error) {
            console.error('Failed to sync selectedWorkouts to server:', error);
        }
    });
}
