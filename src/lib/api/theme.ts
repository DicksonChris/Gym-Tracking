import type PocketBase from 'pocketbase';
import type { AuthRecord } from 'pocketbase';

/**
 * Get the user's theme from the user record; default is 'dracula' if not set or not logged in.
 */
export async function getTheme(pb: PocketBase, user: AuthRecord | null): Promise<string> {
    if (!user) {
        return 'dracula';
    }
    return (user.theme as string) || 'dracula';
}

/**
 * Save the user's theme by updating the user record.
 */
export async function saveTheme(pb: PocketBase, user: AuthRecord | null, theme: string) {
    if (!user) {
        throw new Error('No user is currently logged in');
    }

    await pb.collection('users').update(user.id, { theme });
    // Optionally update the local record
    (user.theme as string) = theme;
}
