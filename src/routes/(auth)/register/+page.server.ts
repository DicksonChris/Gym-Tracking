import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// If already logged in, redirect
export const load: PageServerLoad = async ({ locals }) => {
    if (locals.pb.authStore.isValid) {
        throw redirect(303, '/home');
    }
    return {};
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = formData.get('name')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const password = formData.get('password')?.toString() || '';
        const passwordConfirm = formData.get('passwordConfirm')?.toString() || '';

        // Basic validation example
        if (!email || !password || password !== passwordConfirm) {
            return fail(400, {
                formError: 'Passwords do not match or missing fields.'
            });
        }

        try {
            // PocketBase user creation
            await locals.pb.collection('users').create({
                email,
                emailVisibility: true,
                password,
                passwordConfirm,
                name
            });

            // TODO: Log them in immediately after creation, or you can require them to confirm email, etc.
            await locals.pb.collection('users').authWithPassword(email, password);

            // Redirect or show success
            throw redirect(303, '/');
        } catch (err: any) {
            console.error('Register error:', err);
            return fail(400, {
                formError: err.message || 'Something went wrong registering.'
            });
        }
    }
};
