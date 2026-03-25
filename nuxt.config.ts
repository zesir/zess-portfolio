// https://nuxt.com/docs/api/configuration/nuxt-config
// nuxt.config.ts
export default defineNuxtConfig({
  // date de compatibilité
  compatibilityDate: "2025-07-15",

  // activer devtools
  devtools: { enabled: true },

  // SCSS global
  css: ["@/assets/css/styles.scss"],

  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://use.typekit.net",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;600;700&family=Inter:wght@300;400;800&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://use.typekit.net/cme4duv.css",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  // plugins
  plugins: [
    "~/plugins/gsap.client.ts", // GSAP pour animations
  ],

  // TypeScript strict (optionnel mais conseillé)
  typescript: {
    strict: true,
  },

  // Vite options (si besoin plus tard pour performance)
  vite: {
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
  },

  modules: ["@pinia/nuxt", "@nuxt/icon", "@nuxtjs/i18n"],

  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "locale",
      redirectOn: "root",
      fallbackLocale: "en",
    },
    vueI18n: "./i18n.config.ts",
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },
});
