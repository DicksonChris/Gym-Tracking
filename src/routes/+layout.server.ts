import type { LayoutServerLoad } from './$types';
import { ensureSuperuserAuth } from '$lib/api/pocketbase';
import { getTheme } from '$lib/api/theme';

export const load: LayoutServerLoad = async () => {
    await ensureSuperuserAuth();
    const theme = await getTheme();
    return { theme };
};