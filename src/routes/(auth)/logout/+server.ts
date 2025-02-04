import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    locals.pb.authStore.clear();
    throw redirect(303, '/');
};
