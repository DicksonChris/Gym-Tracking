import type { LayoutLoad } from './$types';
import { themeStore } from '$lib/stores/themeStore';

export const load: LayoutLoad = async ({ data }) => {
    themeStore.set(data.theme);
    return data;
};