import PocketBase from 'pocketbase';

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL;
const pb = new PocketBase(pocketbaseUrl);

// Optionally, handle authentication here if needed
// e.g., pb.authStore.loadFromCookie(document.cookie);

export default pb;