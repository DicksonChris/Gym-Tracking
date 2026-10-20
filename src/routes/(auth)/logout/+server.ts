import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST so the session can't be killed by CSRF or link prefetching.
export const POST: RequestHandler = async ({ locals }) => {
    locals.pb.authStore.clear();
    throw redirect(303, '/');
};
