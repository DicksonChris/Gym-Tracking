import pb from './pocketbase';

export interface History {
    id?: string;
    exercise: string;
    startTime: string;
    reps?: number;
    weight?: number;
    distance?: string;
    time?: string;
}

export async function getHistories(): Promise<History[]>  {
    return await pb.collection('history').getFullList<History>();
}

export async function getHistoriesByExercise(id: string): Promise<History[]> {
    return await pb.autoCancellation(false)
        .collection('history')
        .getFullList<History>({
            filter: `exercise="${id}"`
        });
}

export async function getHistory(id: string): Promise<History> {
    return await pb.collection('history').getOne(id);
}

export async function createHistory(data: Partial<History>) {
    return await pb.collection('history').create({
        ...data,
        startTime: new Date().toISOString(),
    });
}

export async function updateHistory(id: string, data: Partial<History>) {
    return await pb.collection('history').update(id, data);
}

export async function deleteHistory(id: string) {
    return await pb.collection('history').delete(id);
}