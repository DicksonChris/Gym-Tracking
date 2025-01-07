import { writable } from 'svelte/store';

// Function to get initial selected workouts from localStorage
function getInitialSelectedWorkouts(): string[] {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('selectedWorkouts');
        return saved ? JSON.parse(saved) : [];
    }
    return [];
}

// Create a writable store initialized with data from localStorage
export const selectedWorkoutsStore = writable<string[]>(getInitialSelectedWorkouts());

// Subscribe to store changes and persist them to localStorage
selectedWorkoutsStore.subscribe((selectedWorkouts) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('selectedWorkouts', JSON.stringify(selectedWorkouts));
    }
});