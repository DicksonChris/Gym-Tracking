import { writable } from 'svelte/store';
import type { Exercise } from '$lib/api/exercises';

/**
 * A Svelte store holding an array of exercises or null if none loaded.
 */
export const exercisesStore = writable<Exercise[] | null>(null);

/**
 * Called on the client after SSR data is fetched or updated on the server side.
 * This overwrites the current store with the new data.
 */
export function setExercises(exercises: Exercise[]) {
    exercisesStore.set(exercises);
}

/**
 * Optionally update or insert a single exercise in the store.
 */
export function upsertExercise(exercise: Exercise) {
    exercisesStore.update((current) => {
        if (!current) {
            return [exercise];
        }
        const idx = current.findIndex((ex) => ex.id === exercise.id);
        if (idx === -1) {
            return [...current, exercise];
        } else {
            const updated = [...current];
            updated[idx] = exercise;
            return updated;
        }
    });
}

/**
 * Optionally remove an exercise by ID from the store.
 */
export function removeExercise(exerciseId: string) {
    exercisesStore.update((current) => {
        if (!current) return null;
        return current.filter((ex) => ex.id !== exerciseId);
    });
}
