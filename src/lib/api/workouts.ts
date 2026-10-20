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
 * Fetch a single workout by ID. Verifies ownership
 * (defense in depth on top of the PocketBase collection rules).
 */
export async function getWorkout(
    pb: PocketBase,
    user: AuthRecord | null,
    workoutId: string
): Promise<Workout> {
    if (!user) {
        throw new Error('Not authenticated');
    }
    const workout = await pb.collection('workouts').getOne<Workout>(workoutId);
    if (workout.user !== user.id) {
        throw new Error('Unauthorized or record not found');
    }
    return workout;
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
    await getWorkout(pb, user, workoutId); // ownership check
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
    await getWorkout(pb, user, workoutId); // ownership check
    await pb.collection('workouts').delete(workoutId);
}
