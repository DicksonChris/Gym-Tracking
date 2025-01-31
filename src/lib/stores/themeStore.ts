// src/lib/stores/themeStore.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * A Svelte store to keep track of the user's chosen theme, default 'dracula'.
 */
export const themeStore = writable<string>('dracula');

/**
 * Overwrite the store with a new theme.
 */
export function setTheme(newTheme: string) {
    themeStore.set(newTheme);
}

// If running in the browser, subscribe to changes and POST to /api/theme
if (browser) {
    themeStore.subscribe(async (value) => {
        try {
            // POST the new theme to /api/theme
            await fetch('/api/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ theme: value })
            });
            // Optionally handle success or error feedback
        } catch (error) {
            console.error('Failed to sync theme to the server:', error);
        }
    });
}
