import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: false,
    loading: {
        color: 'blue',
        height: '5px'
    },
    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config.js',
        exposeConfig: false,
        injectPosition: 0,
        viewer: true,
    },
    colorMode: {
        classSuffix: ''
    },
    publicRuntimeConfig: {
        BASE_URL: process.env.BASE_URL,
    },
    privateRuntimeConfig: {
        BASE_URL: process.env.BASE_URL,
    },
   
})
