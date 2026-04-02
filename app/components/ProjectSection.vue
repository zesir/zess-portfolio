<template>
  <section class="projects-section" ref="interceptor" aria-labelledby="projects-section-heading">

    <div class="projects-sticky-container">
      <div class="projects-header">
        <h2 id="projects-section-heading" class="projectsTitle">{{ lang.projectsSection.title[0] }}<br />{{ lang.projectsSection.title[1] }}</h2>
      </div>
      <div class="projects-slide" ref="projectsSlide">

        <article
          v-for="(project, index) in projects"
          :key="index"
          class="project-card"
          @mouseenter="onMouseEnter($event)"
          @mouseleave="onMouseLeave($event)"
        >
          <a
            :href="`/projects/${project.id}`"
            class="card-link"
            :aria-label="project.title"
            @click.prevent="goToProject(project.id)"
            @focus="onMouseEnter($event)"
            @blur="onMouseLeave($event)"
          >
            <div class="card-info">
              <span>0{{ index + 1 }}</span>
              <h3>{{ project.title }}</h3>
              <p>{{ project.category }}</p>
            </div>
            <div class="card-content">
              <div class="image-placeholder">
                <NuxtImg
                  :src="project.image"
                  :alt="project.title"
                  class="project-img"
                  sizes="535px"
                  :width="535"
                  :height="301"
                />
              </div>
            </div>
          </a>
        </article>

        <div class="projects-spacer"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import langData from "@/data/lang.json";
import projectsData from "@/data/projects.json";
import { useThemeStore } from "@/stores/useThemeStore";
import { computed, nextTick } from "vue";

const { locale } = useI18n({ useScope: "global" });
const lang = computed(() => langData[locale.value.startsWith("fr") ? "fr" : "en"]);

const { $gsap } = useNuxtApp();
const interceptor = ref(null);
const projectsSlide = ref(null);
const themeStore = useThemeStore();

const projects = computed(() =>
  projectsData.map((p) => ({ ...p, ...p.translations[locale.value.startsWith("fr") ? "fr" : "en"] }))
);

const router = useRouter();
const visitorName = computed(() => themeStore.confirmedName || lang.value.welcome.fallback);
const toast = useProjectToast();

const goToProject = async (id: string) => {
  const variants = lang.value.projectsSection.toasts;
  const variant = variants[Math.floor(Math.random() * variants.length)]!;
  toast.show(variant.prefix, visitorName.value, variant.suffix);
  await nextTick();
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
const onMouseEnter = (event: MouseEvent | FocusEvent) => {
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

const onMouseLeave = (event: MouseEvent | FocusEvent) => {
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
