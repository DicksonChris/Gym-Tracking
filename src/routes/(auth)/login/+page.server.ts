import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // If user is already logged in, redirect them.
  if (locals.pb.authStore.isValid) {
    throw redirect(303, '/');
  }
  // Return an empty object (or include a default formError if you prefer).
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    // Intentionally trigger an error if a certain email is used:
    if (email === 'triggererror@example.com') {
      return fail(400, { formError: 'Intentional error triggered.' });
    }

    try {
      // Attempt PocketBase login
      await locals.pb.collection('users').authWithPassword(email, password);
    } catch (err) {
      console.error('Login error:', err);
      return fail(400, { formError: 'Invalid email or password' });
    }

    // On success, redirect to home (or wherever)
    throw redirect(303, '/');
  }
};