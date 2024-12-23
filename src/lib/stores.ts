import { writable } from 'svelte/store';
import { fetchWorkouts, fetchExercises, fetchHistory } from './api';

export const workoutsStore = writable([]);
export const exercisesStore = writable({});
export const historyStore = writable({});

export async function loadWorkouts() {
    const data = await fetchWorkouts();
    workoutsStore.set(data);
}

export async function loadExercises() {
    const data = await fetchExercises();
    const mapped = data.reduce((acc, exercise) => {
        acc[exercise.id] = exercise;
        return acc;
    }, {});
    exercisesStore.set(mapped);
}

export async function loadHistory() {
    const data = await fetchHistory();
    const mapped = data.reduce((acc, entry) => {
        if (!acc[entry.exerciseId]) acc[entry.exerciseId] = [];
        acc[entry.exerciseId].push(entry);
        return acc;
    }, {});
    historyStore.set(mapped);
}
