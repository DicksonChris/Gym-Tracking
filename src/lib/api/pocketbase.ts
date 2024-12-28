import PocketBase from 'pocketbase';

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL;
const pb = new PocketBase(pocketbaseUrl);

// Authenticate as superuser
async function authenticateSuperuser() {
    const email = import.meta.env.VITE_SUPERUSER_EMAIL;
    const password = import.meta.env.VITE_SUPERUSER_PASSWORD;

    try {
        await pb.collection('_superusers').authWithPassword(email, password);
        console.log('Authenticated as superuser');
    } catch (error) {
        console.error('Failed to authenticate as superuser:', error);
    }
}

authenticateSuperuser();

export default pb;