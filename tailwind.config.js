import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config & {daisyui: import('daisyui').Config}} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.ts",
        "./resources/**/*.js",
        "./resources/**/*.vue",
    ],
    plugins: [
        typography,
        daisyui,
    ],
    daisyui: {
        logs: false,
        themes: true,
    }
}
