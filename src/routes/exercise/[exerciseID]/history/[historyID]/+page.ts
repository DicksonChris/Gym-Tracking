import { getHistory } from '$lib/api/history';
import { ensureSuperuserAuth } from '$lib/api/pocketbase.js';

export const load = async ({ params }) => {
	await ensureSuperuserAuth();

	const { exerciseID, historyID } = params;

	try {
		const history = await getHistory(historyID);
		return {
			exerciseID,
			history
		};
	} catch (error) {
		console.error('Error loading history:', error);
		// Optionally, redirect or return default values
		return {
			exerciseID,
			history: null
		};
	}
};
