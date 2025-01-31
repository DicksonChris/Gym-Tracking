import type { RequestHandler } from './$types';
import { createWorkout, updateWorkout } from '$lib/api/workouts';

export const POST: RequestHandler = async ({ request, locals }) => {
    // user must be logged in
    const user = locals.pb.authStore.record;
    if (!user) {
        return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, groupName, exercises } = body; // minimal fields

        if (id === 'new' || !id) {
            // create a new workout
            const record = await createWorkout(locals.pb, user, {
                groupName,
                exercises
            });
            return new Response(JSON.stringify(record), { status: 200 });
        } else {
            // update existing
            const updated = await updateWorkout(locals.pb, user, id, {
                groupName,
                exercises
            });
            return new Response(JSON.stringify(updated), { status: 200 });
        }
    } catch (err: any) {
        console.error('Error in POST /api/workouts:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
};
