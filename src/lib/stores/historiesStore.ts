import { writable } from 'svelte/store';
import { 
    getHistoriesByExercise, 
    createHistory, 
    updateHistory, 
    deleteHistory as apiDeleteHistory, // Alias to avoid naming conflict
    type History 
} from '$lib/api/history';

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

export async function saveHistory(exerciseID: string, data: Partial<History>, id?: string) {
    try {
        let history: History;
        if (id) {
            history = await updateHistory(id, data);
        } else {
            history = await createHistory({ ...data, exercise: exerciseID });
        }
        historiesStore.update(store => {
            const updatedHistories = store[exerciseID] ? [...store[exerciseID]] : [];
            if (id) {
                const index = updatedHistories.findIndex(h => h.id === id);
                if (index !== -1) {
                    updatedHistories[index] = history;
                }
            } else {
                updatedHistories.push(history);
            }
            return {
                ...store,
                [exerciseID]: updatedHistories.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            };
        });
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

export async function deleteHistory(exerciseID: string, id: string) {
    try {
        await apiDeleteHistory(id); // Call the API to delete the history

        // Update the store by removing the deleted history
        historiesStore.update(store => {
            const updatedHistories = store[exerciseID]?.filter(history => history.id !== id) || [];
            return {
                ...store,
                [exerciseID]: updatedHistories.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            };
        });
    } catch (error) {
        console.error('Error deleting history:', error);
    }
}

// Helper function to get store value without subscribing
function getStoreValue<T>(store: import('svelte/store').Readable<T>) {
    let value: T;
    store.subscribe((v) => (value = v))();
    return value;
}