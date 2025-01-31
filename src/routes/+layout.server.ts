import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const user = locals.pb.authStore.record;
    const theme = user?.theme || 'dracula';

    return { user, theme };
};
