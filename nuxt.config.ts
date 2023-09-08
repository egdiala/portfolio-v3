// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%siteName %titleSeparator %pageTitle'
    }
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/egdiala/image/upload/'
    }
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  devtools: { enabled: true },
  pages: true,
  extends: ["nuxt-seo-kit"],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://egdiala-v3.netlify.app',
      siteName: 'Egwuchukwu S. Diala',
      siteDescription: 'Egwuchukwu Diala\'s Portfolio Website',
      language: 'en',
      titleSeparator: '-',
    }
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-headlessui",
    "@nuxt/image",
    "nuxt-icon",
    "nuxt-swiper",
    "nuxt-og-image",
    "@vueuse/motion/nuxt"
  ],
  colorMode: { classSuffix: '' },
  ssr: true
})