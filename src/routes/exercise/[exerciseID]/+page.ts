import { ensureSuperuserAuth } from '$lib/api/pocketbase';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	await ensureSuperuserAuth();

	return {
		slug: params.exerciseID
	};
};
