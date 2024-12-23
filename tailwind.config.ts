import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {}
    },

    plugins: [typography, forms, daisyui],

    daisyui: {
        themes: [
            "business", // Set as default by placing first
            "dark",
            "synthwave",
            "halloween",
            "forest",
            "aqua",
            "black",
            "luxury",
            "dracula",
            "night",
            "coffee",
            "dim",
            "sunset"
        ],
    }
} satisfies Config;
