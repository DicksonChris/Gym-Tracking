import type PocketBase from 'pocketbase';
import type { AuthRecord } from 'pocketbase';

/**
 * Return the "selectedWorkouts" field from the user record (array of string IDs).
 */
export async function getSelectedWorkouts(pb: PocketBase, user: AuthRecord | null): Promise<string[]> {
    if (!user) return [];
    // The user record might have "selectedWorkouts" as an array field
    return (user.selectedWorkouts as string[]) || [];
}

/**
 * Save "selectedWorkouts" to the user's record.
 */
export async function saveSelectedWorkouts(
    pb: PocketBase,
    user: AuthRecord | null,
    workouts: string[]
) {
    if (!user) {
        throw new Error('No user is currently logged in');
    }

    await pb.collection('users').update(user.id, { selectedWorkouts: workouts });

    // Optionally update the local record so we don't have to reload
    (user.selectedWorkouts as string[]) = workouts;
}
