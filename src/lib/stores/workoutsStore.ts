import { writable, get } from 'svelte/store';
import type { Workout } from '$lib/api/workouts';

/**
 * A store that holds the current user's workouts (or null if not loaded).
 */
export const workoutsStore = writable<Workout[] | null>(null);

/**
 * Overwrite the entire workouts array. 
 */
export function setWorkouts(workouts: Workout[]) {
    workoutsStore.set(workouts);
}

/**
 * Insert or update a single workout in the store.
 */
export function upsertWorkout(workout: Workout) {
    workoutsStore.update((list) => {
        if (!list) return [workout];
        const idx = list.findIndex((w) => w.id === workout.id);
        if (idx === -1) {
            return [...list, workout];
        } else {
            const updated = [...list];
            updated[idx] = workout;
            return updated;
        }
    });
}

/**
 * Remove a workout by ID from the store.
 */
export function removeWorkout(workoutId: string) {
    workoutsStore.update((list) => {
        if (!list) return null;
        return list.filter((w) => w.id !== workoutId);
    });
}
