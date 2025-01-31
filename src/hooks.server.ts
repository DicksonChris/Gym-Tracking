import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL;

export const handle: Handle = async ({ event, resolve }) => {
    const pb = new PocketBase(pocketbaseUrl);

    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh();
        }
    } catch (_) {
        pb.authStore.clear();
    }

    event.locals.pb = pb;

    const response = await resolve(event);

    response.headers.append('set-cookie', pb.authStore.exportToCookie());

    return response;
};
