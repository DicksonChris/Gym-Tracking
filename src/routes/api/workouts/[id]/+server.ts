import type { RequestHandler } from './$types';
import { deleteWorkout } from '$lib/api/workouts';

export const DELETE: RequestHandler = async ({ params, locals }) => {
    const user = locals.pb.authStore.record;
    if (!user) {
        return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
    }
    try {
        await deleteWorkout(locals.pb, user, params.id);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
};
