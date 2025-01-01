import pb from './pocketbase';

export interface Workout {
    id: string;
    groupName: string;
    exercises?: string[];
}

export async function createWorkout(data: Partial<Workout>) {
    return await pb.collection('workouts').create(data);
}

export async function getWorkouts(): Promise<Workout[]> {
    return await pb.collection<Workout>('workouts').getFullList<Workout>();
}

export async function getWorkout(id: string): Promise<Workout> {
    return await pb.collection('workouts').getOne(id);
}

export async function updateWorkout(id: string, data: Partial<Workout>): Promise<Workout> {
    return await pb.collection('workouts').update(id, data);
}
