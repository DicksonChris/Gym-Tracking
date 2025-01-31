import type PocketBase from 'pocketbase';
import type { AuthRecord } from 'pocketbase';

export interface History {
    id?: string;
    user?: string;   // The relation to the "users" collection
    exercise: string; // Relation or ID referencing an Exercise
    startTime: string;
    reps?: number;
    weight?: number;
    distance?: string;
    time?: string;
}

/**
 * Simple validation: at least one of reps, weight, distance, or time must be present.
 */
function isValidHistory(data: Partial<History>): boolean {
    return !!(data.reps || data.weight || data.distance || data.time);
}

/**
 * Fetch all history records for the current user.
 */
export async function getHistories(pb: PocketBase, user: AuthRecord | null): Promise<History[]> {
    if (!user) return [];
    try {
        const records = await pb.collection('history').getFullList<History>({
            filter: `user = "${user.id}"`
        });
        return records;
    } catch (error) {
        console.error('Error fetching histories:', error);
        throw error;
    }
}

/**
 * Fetch all History items for a given exercise ID, belonging to the current user.
 */
export async function getHistoriesByExercise(
    pb: PocketBase,
    user: AuthRecord | null,
    exerciseId: string
): Promise<History[]> {
    if (!user) return [];
    return await pb
        .autoCancellation(false)
        .collection('history')
        .getFullList<History>({
            filter: `user = "${user.id}" && exercise = "${exerciseId}"`
        });
}

/**
 * Fetch a single History item by ID. 
 * With PocketBase's rule user=@request.auth.id, this should 404 if not the owner.
 */
export async function getHistory(
    pb: PocketBase,
    user: AuthRecord | null,
    historyId: string
): Promise<History> {
    // You could optionally do an ownership check here if needed
    return await pb.collection('history').getOne<History>(historyId);
}

/**
 * Create new History entry, owned by the user.
 */
export async function createHistory(
    pb: PocketBase,
    user: AuthRecord | null,
    data: Partial<History>
): Promise<History> {
    if (!isValidHistory(data)) {
        throw new Error('Cannot create a history with no data (reps, weight, distance, time).');
    }
    if (!user) {
        throw new Error('Not authenticated');
    }
    return await pb.collection('history').create({
        ...data,
        user: user.id,
        startTime: new Date().toISOString()
    });
}

/**
 * Update an existing History item.
 */
export async function updateHistory(
    pb: PocketBase,
    user: AuthRecord | null,
    historyId: string,
    data: Partial<History>
): Promise<History> {
    if (!isValidHistory(data)) {
        throw new Error('Cannot update a history to have no data.');
    }
    if (!user) {
        throw new Error('Not authenticated');
    }
    return await pb.collection('history').update(historyId, data);
}

/**
 * Delete a History item by ID.
 */
export async function deleteHistory(
    pb: PocketBase,
    user: AuthRecord | null,
    historyId: string
): Promise<void> {
    if (!user) {
        throw new Error('Not authenticated');
    }
    await pb.collection('history').delete(historyId);
}
