import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim() || '';

		if (!email) {
			return fail(400, { formError: 'Email is required.' });
		}

		try {
			await locals.pb.collection('users').requestPasswordReset(email);
		} catch (err) {
			// Swallow errors so the response never reveals whether an account exists.
			console.error('Password reset request error:', err);
		}

		return { success: true };
	}
};
