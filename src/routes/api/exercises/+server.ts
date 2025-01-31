import type { RequestHandler } from './$types';
import { createExercise, updateExercise } from '$lib/api/exercises';

export const POST: RequestHandler = async ({ request, locals }) => {
    const user = locals.pb.authStore.record;
    if (!user) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, name, muscleGroup, measurement, defaultReps, defaultStep, hidden } = body;

        // If you want to handle toggles specifically
        if (id && hidden !== undefined && !name && !muscleGroup) {
            // i.e. toggling hidden only
            const updated = await updateExercise(locals.pb, user, id, { hidden });
            return new Response(JSON.stringify(updated), { status: 200 });
        }

        // Otherwise handle the full create/update logic
        if (id === 'new') {
            const record = await createExercise(locals.pb, user, {
                name,
                muscleGroup,
                measurement,
                defaultReps,
                defaultStep
            });
            return new Response(JSON.stringify(record), { status: 200 });
        } else {
            const updated = await updateExercise(locals.pb, user, id, {
                name,
                muscleGroup,
                measurement,
                defaultReps,
                defaultStep,
                hidden
            });
            return new Response(JSON.stringify(updated), { status: 200 });
        }
    } catch (err: any) {
        console.error('Error in POST /api/exercises:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
};
