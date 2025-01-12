import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { saveTheme } from '$lib/api/theme';

export const themeStore = writable<string>('dracula');

if (browser) {
    themeStore.subscribe(value => {
        document.documentElement.setAttribute('data-theme', value);
        saveTheme(value).catch(console.error);
    });
}