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
            "dark",
            "synthwave",
            "halloween",
            "forest",
            "aqua",
            "black",
            "luxury",
            "dracula",
            "business",
            "night",
            "coffee",
            "dim",
            "sunset"], // Added "cupcake" theme
    }
} satisfies Config;
