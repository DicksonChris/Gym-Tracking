import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { seedDefaultProgram } from '$lib/api/defaultProgram';

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
        const seedDefaults = formData.get('seedDefaults') !== null;

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

            // Log them in immediately after creation
            await locals.pb.collection('users').authWithPassword(email, password);
        } catch (err: any) {
            console.error('Register error:', err);
            return fail(400, {
                formError: err.message || 'Something went wrong registering.'
            });
        }

        // Seed the starter program if requested. A failure here shouldn't
        // block the (already successful) registration.
        if (seedDefaults) {
            const user = locals.pb.authStore.record;
            if (user) {
                try {
                    await seedDefaultProgram(locals.pb, user.id);
                } catch (err) {
                    console.error('Error seeding default program:', err);
                }
            }
        }

        // Must be thrown outside the try/catch, otherwise the redirect is
        // swallowed and reported as a registration failure.
        throw redirect(303, '/home');
    }
};
