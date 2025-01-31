import type { RequestHandler } from './$types';
import { saveSelectedWorkouts } from '$lib/api/selectedWorkouts';

export const POST: RequestHandler = async ({ locals, request }) => {
    // If not authenticated, block
    if (!locals.pb.authStore.isValid) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    const user = locals.pb.authStore.record;
    if (!user) {
        return new Response(JSON.stringify({ error: 'No user record in authStore' }), { status: 401 });
    }

    try {
        const { workouts } = await request.json();
        if (!Array.isArray(workouts)) {
            return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
        }

        // save to PocketBase
        await saveSelectedWorkouts(locals.pb, user, workouts);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err: any) {
        console.error('Error saving selected workouts:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
};
