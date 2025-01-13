import pb from '$lib/api/pocketbase';

export interface History {
    id?: string;
    exercise: string;
    startTime: string;
    reps?: number;
    weight?: number;
    distance?: string;
    time?: string;
}

function isValidHistory(data: Partial<History>): boolean {
    // At least one of the following fields must be present
    return !!(data.reps || data.weight || data.distance || data.time);
}

export async function getHistories(): Promise<History[]>  {
    try {
        const records = await pb.collection('history').getFullList<History>();
        return records;
    } catch (error) {
        console.error('Error fetching histories:', error);
        throw error;
    }
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

export async function createHistory(data: Partial<History>): Promise<History> {
    if (!isValidHistory(data)) {
        throw new Error('Cannot create a history with no data.');
    }

    return await pb.collection('history').create({
        ...data,
        startTime: new Date().toISOString(),
    });
}

export async function updateHistory(id: string, data: Partial<History>): Promise<History> {
    if (!isValidHistory(data)) {
        throw new Error('Cannot update a history to have no data.');
    }

    return await pb.collection('history').update(id, data);
}

export async function deleteHistory(id: string): Promise<void> {
    await pb.collection('history').delete(id);
}