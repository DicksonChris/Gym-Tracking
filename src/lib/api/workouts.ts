import pb from '$lib/api/pocketbase';

export interface Workout {
    id: string;
    groupName: string;
    exercises?: string[];
}

export async function createWorkout(data: Partial<Workout>) {
    return await pb.collection('workouts').create(data);
}

export async function getWorkouts(): Promise<Workout[]> {
    try {
        const records = await pb.collection('workouts').getFullList<Workout>();
        return records;
    } catch (error) {
        console.error('Error fetching workouts:', error);
        throw error;
    }
}

export async function getWorkout(id: string): Promise<Workout> {
    return await pb.collection('workouts').getOne(id);
}

export async function updateWorkout(id: string, data: Partial<Workout>): Promise<Workout> {
    return await pb.collection('workouts').update(id, data);
}

export async function deleteWorkout(id: string): Promise<void> {
    await pb.collection('workouts').delete(id);
}