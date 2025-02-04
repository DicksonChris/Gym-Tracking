import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const isUser = Boolean(locals.pb.authStore.record);

    return {
        isUser
    };
};