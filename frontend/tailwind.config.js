/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#708238", // Olive
                "brand-maroon": "#550000",
                "maroon": "#550000",
                "brand-gold": "#FFD700",
                "gold": "#FFD700",
                "background-light": "#FFFFFF",
                "background-dark": "#121212",
            },
            fontFamily: {
                display: ["Playfair Display", "serif"],
                newsreader: ["Newsreader", "serif"],
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.5rem",
            },
        },
    },
    plugins: [],
}
