# Zess — Portfolio

Portfolio personnel de développeur créatif, construit en **Full-Code** avec Nuxt 4 et Vue 3.

## Approche technique

Développement full-code : aucun constructeur de site ni template tiers. L'ensemble du code est écrit manuellement, versionné sur Git et déployé via une pipeline CI/CD.

## Stack

- **Framework** : [Nuxt 4](https://nuxt.com) + Vue 3 (Composition API, TypeScript)
- **Animations** : [GSAP](https://gsap.com) avec ScrollTrigger, SplitText et ScrollToPlugin
- **Internationalisation** : [@nuxtjs/i18n](https://i18n.nuxtjs.org) — EN / FR
- **État global** : [Pinia](https://pinia.vuejs.org)
- **Formulaire de contact** : [EmailJS](https://www.emailjs.com)
- **Préchargeur** : [Lottie-web](https://airbnb.io/lottie)
- **Style** : SCSS global, Google Fonts (Anton, Space Grotesk, Inter)
- **Icônes** : [@nuxt/icon](https://github.com/nuxt/icon)

## Fonctionnalités

- Scroll piloté par GSAP avec pinning et transitions de sections
- Personnalisation dynamique : couleur d'accent générée depuis le nom du visiteur
- Navigation bilingue (FR/EN) avec détection automatique de la langue
- Pages de projet avec parallaxe, vidéo et navigation Précédent/Suivant
- Formulaire de contact fonctionnel (EmailJS)
- Curseur personnalisé (desktop uniquement)
- Préchargeur animé (Lottie), affiché une seule fois par session
- SEO : balises meta, Open Graph, Twitter Card, sitemap, robots.txt
- Accessibilité : balises ARIA, navigation clavier, labels de formulaire, focus trap

## Lancer le projet en local

```bash
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

## Build de production

```bash
npm run build
npm run preview
```

## Déploiement

Le site est déployé sur [à compléter après mise en ligne].

## Structure du projet

```
app/
├── components/     # Composants Vue (Hero, Bio, Projets, Contact…)
├── pages/          # Pages Nuxt (index, /projects/[id])
├── data/           # Contenus JSON (projets, traductions)
├── stores/         # Stores Pinia (thème, langue)
├── composables/    # Logique réutilisable (toast)
├── plugins/        # GSAP (client-side)
└── assets/css/     # SCSS global
public/
├── images/         # Captures d'écran des projets
└── videos/         # Vidéos de démonstration
```
