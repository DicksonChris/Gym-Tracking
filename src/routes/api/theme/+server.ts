import type { RequestHandler } from './$types';
import { saveTheme } from '$lib/api/theme';

export const POST: RequestHandler = async ({ locals, request }) => {
    const user = locals.pb.authStore.record;
    if (!user) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    try {
        const { theme } = await request.json();
        if (typeof theme !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid theme' }), { status: 400 });
        }

        await saveTheme(locals.pb, user, theme);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err: any) {
        console.error('Error saving theme:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
};
