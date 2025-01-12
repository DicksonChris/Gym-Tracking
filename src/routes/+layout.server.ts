import type { LayoutServerLoad } from './$types';
import { getTheme } from '$lib/api/theme';

export const load: LayoutServerLoad = async () => {
    const theme = await getTheme();
    return { theme };
};