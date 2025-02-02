import type { PageServerLoad } from './$types';
import { getExercises } from '$lib/api/exercises';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.pb.authStore.record;
    if (!user) {
        return { allExercises: [] };
    }

    try {
        const all = await getExercises(locals.pb, user, true);
        return { allExercises: all };
    } catch (error) {
        console.error('Error loading exercises:', error);
        return { allExercises: [] };
    }
};
