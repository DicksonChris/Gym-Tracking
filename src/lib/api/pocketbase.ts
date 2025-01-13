import PocketBase from 'pocketbase';

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL;
const pb = new PocketBase(pocketbaseUrl);

// This Promise ensures we only authenticate superuser once.
let authPromise: Promise<void> | null = null;

export async function ensureSuperuserAuth(): Promise<void> {
    // If we already initiated auth, just wait for it to finish.
    if (authPromise) {
        return authPromise;
    }

    // Otherwise, start superuser auth.
    const email = import.meta.env.VITE_SUPERUSER_EMAIL;
    const password = import.meta.env.VITE_SUPERUSER_PASSWORD;

    authPromise = pb
        .collection('_superusers')
        .authWithPassword(email, password)
        .then(() => {
            console.log('Authenticated as superuser');
        })
        .catch((error) => {
            console.error('Failed to authenticate as superuser:', error);
            throw error;
        });

    return authPromise;
}

export default pb;
