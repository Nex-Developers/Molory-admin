// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,
    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
    build: {
        transpile: ['chart.js'],
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    css: [
        '@/css/main.css',
    ],
    runtimeConfig: {
        public: {
            // BASE_URL: 'http://localhost/molory-backend/api',
            BASE_URL: 'http://143.47.181.28:81/backend-dev/api',
        }
    },

})
