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
      htmlAttrs: { lang: "en" },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Zess — Creative Developer",
      meta: [
        {
          name: "description",
          content:
            "Portfolio of Zess, a Creative Developer crafting immersive digital experiences with modern web technologies.",
        },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Zess — Creative Developer" },
        {
          property: "og:description",
          content:
            "Portfolio of Zess, a Creative Developer crafting immersive digital experiences with modern web technologies.",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Zess — Creative Developer" },
        {
          name: "twitter:description",
          content:
            "Portfolio of Zess, a Creative Developer crafting immersive digital experiences with modern web technologies.",
        },
      ],
      script: [{ innerHTML: "history.scrollRestoration = 'manual'" }],
      noscript: [
        {
          innerHTML:
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;600;700&family=Inter:wght@300;400;800&display=swap"><link rel="stylesheet" href="https://use.typekit.net/cme4duv.css">',
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon/favicon.ico" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon/favicon.svg" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicon/favicon-96x96.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favicon/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/favicon/site.webmanifest" },

        // Preconnects
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        { rel: "preconnect", href: "https://use.typekit.net", crossorigin: "" },
        { rel: "preconnect", href: "https://p.typekit.net", crossorigin: "" },

        // Google Fonts — non-bloquant
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;600;700&family=Inter:wght@300;400;800&display=swap",
        },

        // TypeKit — non-bloquant
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

  modules: ["@pinia/nuxt", "@nuxt/icon", "@nuxtjs/i18n", "@nuxt/image"],

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
