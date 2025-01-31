import type PocketBase from 'pocketbase';
import type { AuthRecord } from 'pocketbase';

export interface Workout {
    id: string;
    user?: string;         // Relation to the "users" collection
    groupName: string;
    exercises?: string[];  // Array of Exercise record IDs
}

/**
 * Create a new workout, owned by the current user.
 */
export async function createWorkout(
    pb: PocketBase,
    user: AuthRecord | null,
    data: Partial<Workout>
) {
    if (!user) {
        throw new Error('Not authenticated');
    }
    return await pb.collection('workouts').create({
        ...data,
        user: user.id
    });
}

/**
 * Fetch all workouts for the current user.
 */
export async function getWorkouts(pb: PocketBase, user: AuthRecord | null): Promise<Workout[]> {
    if (!user) return [];
    try {
        const records = await pb.collection('workouts').getFullList<Workout>({
            filter: `user = "${user.id}"`
        });
        return records;
    } catch (error) {
        console.error('Error fetching workouts:', error);
        throw error;
    }
}

/**
 * Fetch a single workout by ID. 
 * PocketBase rules should prevent reading if it's not owned by the current user.
 */
export async function getWorkout(
    pb: PocketBase,
    user: AuthRecord | null,
    workoutId: string
): Promise<Workout> {
    return await pb.collection('workouts').getOne<Workout>(workoutId);
}

/**
 * Update a workout by ID.
 */
export async function updateWorkout(
    pb: PocketBase,
    user: AuthRecord | null,
    workoutId: string,
    data: Partial<Workout>
): Promise<Workout> {
    if (!user) {
        throw new Error('Not authenticated');
    }
    return await pb.collection('workouts').update(workoutId, data);
}

/**
 * Delete a workout by ID.
 */
export async function deleteWorkout(
    pb: PocketBase,
    user: AuthRecord | null,
    workoutId: string
): Promise<void> {
    if (!user) {
        throw new Error('Not authenticated');
    }
    await pb.collection('workouts').delete(workoutId);
}
