import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// We'll also export a load function if we want to pass data to the page (e.g., if user is already logged in)
export const load: PageServerLoad = async ({ locals }) => {
    // If user is already logged in, redirect them
    if (locals.pb.authStore.isValid) {
        throw redirect(303, '/');
    }
    return {};
};

export const actions: Actions = {
    /**
     * We name the default action "default". This action is triggered
     * by a <form> with no `name` attribute.
     */
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString() || '';
        const password = formData.get('password')?.toString() || '';

        try {
            // Attempt PocketBase login
            await locals.pb.collection('users').authWithPassword(email, password);
        } catch (err) {
            console.error('Login error:', err);
            // Return data that our +page.svelte can display
            return fail(400, {
                formError: 'Invalid email or password'
            });
        }

        // On success, redirect to home (or wherever)
        throw redirect(303, '/');
    }
};
