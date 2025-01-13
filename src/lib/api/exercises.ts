import pb from '$lib/api/pocketbase';

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: string;
    measurement?: string[];
    hidden?: boolean;
    defaultReps?: number;
    defaultStep?: number;
    url?: string;
}

export let showHidden = false;

export async function getExercises(): Promise<Exercise[]> {
    try {
        const records = await pb.collection('exercises').getFullList<Exercise>();
        return records;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        throw error;
    }
}

export async function getExercise(id: string): Promise<Exercise> {
    if (showHidden) {
        return await pb.collection<Exercise>('exercises').getOne(id);
    }
    const exercise = await pb.collection<Exercise>('exercises').getOne(id);
    if (exercise.hidden) {
        throw new Error('Exercise not found');
    }
    return exercise;
}

export async function createExercise(data: Partial<Exercise>) {
    return await pb.collection('exercises').create(data);
}

export async function hideExercise(id: string) {
    return await pb.collection('exercises').update(id, { hidden: true });
}

export async function unhideExercise(id: string) {
    return await pb.collection('exercises').update(id, { hidden: false });
}

export async function updateExercise(id: string, data: Partial<Exercise>) {
    return await pb.collection('exercises').update(id, data);
}