export async function fetchWorkouts() {
    try {
        const response = await fetch('http://localhost:3000/workouts');
        if (!response.ok) throw new Error('Failed to fetch workouts');
        return await response.json();
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return [];
    }
}

export async function fetchExercises() {
    try {
        const response = await fetch('http://localhost:3000/exercises');
        if (!response.ok) throw new Error('Failed to fetch exercises');
        return await response.json();
    } catch (error) {
        console.error('Error fetching exercises:', error);
        return [];
    }
}

export async function fetchHistory() {
    try {
        const response = await fetch('http://localhost:3000/history');
        if (!response.ok) throw new Error('Failed to fetch history');
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
}
