import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
            },
        }
    },

    plugins: [typography, forms, daisyui],

    daisyui: {
        themes: [
            "dracula",
            "dark",
            "synthwave",
            "halloween",
            "forest",
            "aqua",
            "black",
            "luxury",
            "business",
            "night",
            "coffee",
            "dim",
            "sunset"], 
    }
} satisfies Config;
