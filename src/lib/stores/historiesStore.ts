import { writable } from 'svelte/store';
import type { History } from '$lib/api/history';

/**
 * A store keyed by exerciseID -> array of History items
 */
export const historiesStore = writable<Record<string, History[]>>({});

/**
 * (Individual exercise) Overwrite the histories for a given exercise ID.
 */
export function setExerciseHistories(exerciseId: string, histories: History[]) {
    historiesStore.update((store) => ({
        ...store,
        [exerciseId]: histories
            .slice()
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    }));
}

/**
 * Insert or update a single history item for a given exercise ID.
 */
export function upsertHistory(exerciseId: string, history: History) {
    historiesStore.update((store) => {
        const existing = store[exerciseId] || [];
        const idx = existing.findIndex((h) => h.id === history.id);
        let updated;
        if (idx === -1) {
            updated = [...existing, history];
        } else {
            updated = [...existing];
            updated[idx] = history;
        }
        return {
            ...store,
            [exerciseId]: updated.sort(
                (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            )
        };
    });
}

/**
 * Remove a history item by ID.
 */
export function removeHistory(exerciseId: string, historyId: string) {
    historiesStore.update((store) => {
        const existing = store[exerciseId] || [];
        const updated = existing.filter((h) => h.id !== historyId);
        return {
            ...store,
            [exerciseId]: updated
        };
    });
}

/**
 * NEW FUNCTION:
 * Accepts a record object keyed by exerciseId -> History[].
 * Sets the entire store at once for all exercises.
 */
export function setAllHistories(allHistories: Record<string, History[]>) {
    // Sort each exercise's array by startTime.
    const sorted = Object.fromEntries(
        Object.entries(allHistories).map(([exerciseId, list]) => {
            const sortedList = list.slice().sort(
                (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            );
            return [exerciseId, sortedList];
        })
    );
    historiesStore.set(sorted);
}
