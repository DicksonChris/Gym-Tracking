import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }: { locals: any; url: URL }) => {
	// Get the authenticated user from PocketBase.
	const user = locals.pb.authStore.record;
	let theme = 'dracula';

	// If no user is found and the current path is not /login or /register,
	// redirect to /login.
	if (!user && url.pathname !== '/login' && url.pathname !== '/register' && url.pathname !== '/') {
		throw redirect(302, '/login');
	}

	// Set user theme if it exists.
	if (user && user.theme) {
		theme = user.theme;
	}

	return { user, theme };
};
