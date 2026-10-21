import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Get the authenticated user from PocketBase.
	const user = locals.pb.authStore.record;
	let theme;

	// If no user is found and the current path is not a public page,
	// redirect to /login.
	const publicPaths = ['/', '/login', '/register', '/forgot-password'];
	const isPublic =
		publicPaths.includes(url.pathname) || url.pathname.startsWith('/reset-password/');
	if (!user && !isPublic) {
		throw redirect(302, '/login');
	}

	// Set user theme if it exists.
	if (user && user.theme) {
		theme = user.theme;
	}

	return { user, theme };
};
