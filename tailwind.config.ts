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
            'autumn',
            'cmyk',
            'cupcake',
            'cyberpunk',
            {
                fantasy: {
                    ...require('daisyui/src/theming/themes')["fantasy"],
                    "primary": "#58216d",
                    "secondary": "#273583",
                }
            },
            'garden',
            'lemonade',
            'light',
            'pastel',
            'valentine',
            'aqua',
            'black',
            'business',
            'coffee',
            'dark',
            'dim',
            'dracula',
            'forest',
            'halloween',
            'luxury',
            'night',
            'palenight',
            'sunset',
            'synthwave',
            {
                // Palenight
                palenight: {
                    "primary": "#a7fcb3",       // defaultAccent
                    "secondary": "#80CBC4",     // base.blue
                    "accent": "#C792EA",        // base.purple
                    "neutral": "#333747",       // inputBackground
                    "base-100": "#292D3E",      // background
                    "base-200": "#1B1E2B",      // backgroundAlt
                    "base-300": "#424A6C",      // contrastBorder
                    "info": "#89DDFF",          // base.cyan
                    "success": "#C3E88D",       // base.green
                    "warning": "#FFCB6B",       // base.yellow
                    "error": "#f07178",         // base.red
                    "--btn-text-case": "none",
                    "--rounded-box": "0.25rem",
                    "--rounded-btn": "0.25rem"
                }
            }
        ]
    }
} satisfies Config;
