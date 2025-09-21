/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'tg-bg': 'var(--tg-color-bg)',
                'tg-text': 'var(--tg-color-text)',
                'tg-hint': 'var(--tg-color-hint)',
                'tg-link': 'var(--tg-color-link)',
                'tg-button': 'var(--tg-color-button)',
                'tg-button-text': 'var(--tg-color-button-text)',
            }
        },
    },
    plugins: [],
}
