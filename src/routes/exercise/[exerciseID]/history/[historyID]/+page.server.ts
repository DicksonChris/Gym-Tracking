// src/routes/exercise/[exerciseID]/history/[historyID]/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getExercise } from '$lib/api/exercises';
import { deleteHistory, getHistory, updateHistory, type History } from '$lib/api/history';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) {
		throw redirect(303, '/login');
	}

	const exercise = await getExercise(locals.pb, user, params.exerciseID).catch(() => null);
	const history = await getHistory(locals.pb, user, params.historyID).catch(() => null);

	return {
		exercise,
		history
	};
};



export const actions: Actions = {
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
		const historyId = params.historyID;

		if (!reps && !weight && !distance && !time) {
			return fail(400, {
				formError: 'At least one field is required to update'
			});
		}

		const historyData: Partial<History> = {
			reps: reps ? Number(reps) : undefined,
			weight: weight ? Number(weight) : undefined,
			distance: distance?.toString() || undefined,
			time: time?.toString() || undefined
		};

		try {
			await updateHistory(locals.pb, user, historyId, historyData);
		} catch (err: any) {
			console.error('Error updating history:', err);
			return fail(400, {
				formError: err.message || 'Something went wrong updating the history'
			});
		}

		throw redirect(303, `/`);
	},
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
