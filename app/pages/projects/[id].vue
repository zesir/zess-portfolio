<template>
  <div v-if="project" class="project-detail-view">
    <nav class="project-nav">
      <button @click="router.back()" class="back-btn">Retour</button>
    </nav>

    <header class="project-header">
      <h1 class="project-header__title">{{ project.title }}</h1>
      <p class="project-header__cat cat-tag">{{ project.category }}</p>
    </header>

    <div class="project-main-content">
      <div class="col-left">
        <div class="image-wrapper">
          <img :src="project.image" :alt="project.title" class="full-img" />
        </div>
        <article class="description-text">
          <p>{{ project.description }}</p>
          <a :href="project.link" target="_blank" class="external-link"
            >Visiter le site</a
          >
        </article>
      </div>

      <div class="specs-grid">
        <div class="spec-item">
          <h3>Année</h3>
          <p>{{ project.year }}</p>
        </div>
        <div class="spec-item">
          <h3>Rôle</h3>
          <p>{{ project.role }}</p>
        </div>
        <div class="spec-item">
          <h3>Stack</h3>
          <ul class="stack-list">
            <li v-for="tech in project.stack" :key="tech" class="stack-item">
              <Icon
                :name="`simple-icons:${tech}`"
                size="24"
                class="stack__icon"
              />
              <span class="stack__name">{{ tech }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="next-project">
      <button class="next-btn" @click="goToNextProject">Projet suivant</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import projectsData from "@/data/projects.json";

const route = useRoute();
const router = useRouter();

// On récupère l'ID (p1, p2...)
const projectId = route.params.id;

// On cherche l'objet correspondant
const project = projectsData.find((p) => p.id === projectId);

// Sécurité 404
if (!project) {
  throw createError({ statusCode: 404, statusMessage: "Projet introuvable" });
}

// 1. Trouver l'index actuel
const currentIndex = projectsData.findIndex((p) => p.id === projectId);

// 2. Calculer l'index suivant (le modulo % assure la boucle)
// On ajoute une sécurité : si currentIndex est -1 (non trouvé), on commence à 0
const safeIndex = currentIndex === -1 ? 0 : currentIndex;
const nextProjectIndex = (safeIndex + 1) % projectsData.length;

// 3. Récupérer le projet suivant
const nextProject = projectsData[nextProjectIndex];

// 4. La fonction de navigation (TypeScript est content car on vérifie l'existence)
const goToNextProject = () => {
  if (nextProject && nextProject.id) {
    router.push(`/projects/${nextProject.id}`);
  }
};

onMounted(() => {
  const { $gsap } = useNuxtApp();

  // On crée une petite timeline d'entrée
  const tl = $gsap.timeline({
    delay: 0.5, // On attend que la transition Nuxt "out-in" soit finie
  });

  tl.from(".hero img", {
    clipPath: "inset(100% 0% 0% 0%)", // Effet de rideau qui monte
    scale: 1.2,
    duration: 1.5,
    ease: "power4.out",
  })
    .from(
      ".anton-font",
      {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=1",
    ) // Commence un peu avant la fin de l'image
    .from(
      ".info-item",
      {
        y: 20,
        opacity: 0,
        stagger: 0.1, // Les infos arrivent l'une après l'autre
        duration: 0.8,
      },
      "-=0.5",
    );
});
</script>
