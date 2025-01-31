import type PocketBase from 'pocketbase';
import type { AuthRecord } from 'pocketbase';

export interface Exercise {
    id: string;
    user?: string; // The relation field referencing the "users" collection
    name: string;
    muscleGroup: string;
    measurement?: string[];
    hidden?: boolean;
    defaultReps?: number;
    defaultStep?: number;
    url?: string;
}

/**
 * Fetch all exercises belonging to the logged-in user.
 * If showHidden = false, will exclude exercises with hidden = true.
 */
export async function getExercises(
    pb: PocketBase,
    user: AuthRecord | null,
    showHidden = false
): Promise<Exercise[]> {
    if (!user) return [];

    const filterParts = [`user = "${user.id}"`];
    if (!showHidden) {
        filterParts.push(`hidden != true`);
    }
    const filter = filterParts.join(' && ');

    try {
        const records = await pb.collection('exercises').getFullList<Exercise>({
            filter
        });
        return records;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        throw error;
    }
}

/**
 * Fetch a single exercise by ID, ensuring it belongs to the user
 * and is not hidden (if showHidden = false).
 */
export async function getExercise(
    pb: PocketBase,
    user: AuthRecord | null,
    exerciseId: string,
    showHidden = false
): Promise<Exercise> {
    if (!user) {
        throw new Error('Not authenticated');
    }

    const exercise = await pb.collection<Exercise>('exercises').getOne(exerciseId);

    // If you rely solely on PocketBase rules, you can skip manual checks:
    // But here's a sample ownership check:
    if (exercise.user !== user.id) {
        throw new Error('Unauthorized or record not found');
    }

    // If not showing hidden and it's hidden => block
    if (!showHidden && exercise.hidden) {
        throw new Error('Exercise not found');
    }
    return exercise;
}

/**
 * Create an exercise owned by the current user.
 */
export async function createExercise(
    pb: PocketBase,
    user: AuthRecord | null,
    data: Partial<Exercise>
) {
    if (!user) {
        throw new Error('Not authenticated');
    }

    return await pb.collection('exercises').create({
        ...data,
        user: user.id
    });
}

/**
 * Convenience method for hiding an exercise.
 */
export async function hideExercise(
    pb: PocketBase,
    user: AuthRecord | null,
    exerciseId: string
) {
    return await updateExercise(pb, user, exerciseId, { hidden: true });
}

/**
 * Convenience method for unhiding an exercise.
 */
export async function unhideExercise(
    pb: PocketBase,
    user: AuthRecord | null,
    exerciseId: string
) {
    return await updateExercise(pb, user, exerciseId, { hidden: false });
}

/**
 * Update an exercise by ID (relies on PocketBase rule user=@request.auth.id).
 */
export async function updateExercise(
    pb: PocketBase,
    user: AuthRecord | null,
    exerciseId: string,
    data: Partial<Exercise>
) {
    if (!user) {
        throw new Error('Not authenticated');
    }
    return await pb.collection('exercises').update(exerciseId, data);
}
