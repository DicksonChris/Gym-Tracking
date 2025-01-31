import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getExercise } from '$lib/api/exercises';
import { deleteHistory, createHistory, getHistoriesByExercise, type History } from '$lib/api/history';

export const load: PageServerLoad = async ({ params, locals }) => {
    const user = locals.pb.authStore.record;
    if (!user) {
        throw redirect(303, '/login');
    }

    const exercise = await getExercise(locals.pb, user, params.exerciseID).catch(() => null);
    if (!exercise) {
        return { exercise: null, lastHistory: null };
    }

    const allHistories = await getHistoriesByExercise(locals.pb, user, exercise.id);
    const lastHistory = allHistories
        .slice()
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0] || null;

    return {
        exercise,
        lastHistory
    };
};

export const actions: Actions = {
	/**
	 * The default action for creating a new History record.
	 */
	upsert: async ({ request, locals, params }) => {
		const user = locals.pb.authStore.record;
		if (!user) {
			return fail(401, { formError: 'Not authenticated' });
		}

		const formData = await request.formData();
		const reps = formData.get('reps');
		const weight = formData.get('weight');
		const distance = formData.get('distance');
		const time = formData.get('time');

		// At least one field must be provided
		if (!reps && !weight && !distance && !time) {
			return fail(400, {
				formError: 'At least one field (reps, weight, distance, time) must be provided'
			});
		}

		const historyData: Partial<History> = {
			exercise: params.exerciseID,
			startTime: new Date().toISOString(),
			reps: reps ? Number(reps) : undefined,
			weight: weight ? Number(weight) : undefined,
			distance: distance?.toString() || undefined,
			time: time?.toString() || undefined
		};

		try {
			await createHistory(locals.pb, user, historyData);
		} catch (err: any) {
			console.error('Error creating history:', err);
			return fail(400, {
				formError: err.message || 'Something went wrong creating the history'
			});
		}

		throw redirect(303, '/');
	},
    /**
     * Action for deleting a History record.
     */
    delete: async ({ request, locals }) => {
        const user = locals.pb.authStore.record;
        if (!user) {
            return fail(401, { formError: 'Not authenticated' });
        }

        const formData = await request.formData();
        const historyId = formData.get('historyId');
        if (!historyId) {
            return fail(400, { formError: 'Missing historyId' });
        }

        try {
            await deleteHistory(locals.pb, user, historyId.toString());
        } catch (err: any) {
            console.error('Error deleting history:', err);
            return fail(400, { formError: err.message || 'Error deleting history' });
        }

        throw redirect(303, '/');
    }
};
