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
            'palenight',
            {
                // Palenight
                palenight: {
                    "primary": "#1cceee",       // defaultAccent
                    "secondary": "#f6c900",     // base.blue
                    "accent": "#f96d4d",        // base.purple
                    "neutral": "#fbfaca",       // inputBackground
                    "base-100": "#eee1b3",      // background
                    "base-200": "#fbfaca",      // backgroundAlt
                    "base-300": "#e1b980",      // contrastBorder
                    "info": "#89DDFF",          // base.cyan
                    "success": "#C3E88D",       // base.green
                    "warning": "#FFCB6B",       // base.yellow
                    "error": "#f07178",         // base.red
                    "--btn-text-case": "none",
                    "--rounded-box": "1rem",
                    "--rounded-btn": "1rem"
                }
            }
        ]
    }
} satisfies Config;
