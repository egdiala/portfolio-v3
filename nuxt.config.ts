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
    url: 'https://egdiala-v3.netlify.app',
  },
  devtools: { enabled: true },
  pages: true,
  extends: ["nuxt-seo-kit", "nuxt-umami"],
  appConfig: {
    umami: {
      id: 'cccdc190-300e-45a6-9178-63c356330f63',
      host: 'https://eu.umami.is/script.js',
      useDirective: true
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://egdiala-v3.netlify.app',
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
    "nuxt-simple-robots",
    "@vueuse/motion/nuxt",
    "@vueuse/nuxt",
  ],
  colorMode: { classSuffix: '' },
  ssr: true,
})