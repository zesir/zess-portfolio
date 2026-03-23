<template>
  <section class="projects-section" ref="interceptor">
    <div class="projects-sticky-container">
      <div class="projects-slide" ref="projectsSlide">
        <div class="projects-header">
          <h2 class="projectsTitle">Mes<br />Projets</h2>
        </div>

        <div
          v-for="(project, index) in projects"
          :key="index"
          class="project-card"
          @click="goToProject(project.id)"
          @mouseenter="onMouseEnter($event)"
          @mouseleave="onMouseLeave($event)"
        >
          <div class="card-info">
            <span>0{{ index + 1 }}</span>
            <h3>{{ project.title }}</h3>
            <p>{{ project.category }}</p>
          </div>
          <div class="card-content">
            <div class="image-placeholder">
              <img
                :src="project.image"
                :alt="project.title"
                class="project-img"
              />
            </div>
          </div>
        </div>

        <div class="projects-spacer"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import projectsData from "@/data/projects.json";
import { ref } from "vue";

const { $gsap } = useNuxtApp();
const interceptor = ref(null);
const projectsSlide = ref(null);

const projects = ref(projectsData);

const router = useRouter();
const goToProject = (id: string) => {
  router.push(`/projects/${id}`);
};

const initParallax = (parentTimeline: gsap.core.Timeline) => {
  const { $gsap } = useNuxtApp();
  const images = $gsap.utils.toArray(".project-img");

  // On ajoute l'animation DIRECTEMENT dans la timeline parente
  // au moment où le scroll horizontal se produit.
  parentTimeline.to(
    images,
    {
      xPercent: -30, // L'amplitude du mouvement
      ease: "none",
      duration: 8, // DOIT ÊTRE LA MÊME DURÉE que le scroll de slideEl dans index.vue
    },
    "<",
  ); // le "<" signifie "en même temps que le scroll horizontal"
};
const onMouseEnter = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  // On anime le PLACEHOLDER (le parent de l'image)
  const holder = target.querySelector(".image-placeholder");

  if (holder) {
    $gsap.to(holder, {
      scale: 1.15,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
};

const onMouseLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const holder = target.querySelector(".image-placeholder");

  if (holder) {
    $gsap.to(holder, {
      scale: 1,
      duration: 0.6,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }
};
// On expose la fonction pour que le parent puisse l'activer
defineExpose({ interceptor, projectsSlide, initParallax });
</script>
