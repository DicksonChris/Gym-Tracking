import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const password = formData.get('password')?.toString() || '';
		const passwordConfirm = formData.get('passwordConfirm')?.toString() || '';

		if (!password || password.length < 8) {
			return fail(400, { formError: 'Password must be at least 8 characters.' });
		}
		if (password !== passwordConfirm) {
			return fail(400, { formError: 'Passwords do not match.' });
		}

		try {
			await locals.pb
				.collection('users')
				.confirmPasswordReset(params.token, password, passwordConfirm);
		} catch (err) {
			console.error('Password reset confirm error:', err);
			return fail(400, {
				formError: 'This reset link is invalid or has expired. Request a new one.'
			});
		}

		// Outside the try/catch so the redirect isn't swallowed.
		throw redirect(303, '/login');
	}
};
