<template>
  <div v-if="project" class="project-detail-view" :style="{ '--accent-color': themeStore.accentColor }">
    <!-- NAV par dessus -->
    <nav class="project-nav" :class="{ scrolled: navScrolled }">
      <button @click="router.push('/?step=4')" class="back-btn">
        {{ lang.project.back }}
      </button>
    </nav>

    <!-- COVER + HEADER EN OVERLAY -->
    <div class="project-cover" ref="coverRef">
      <img :src="project.image" :alt="project.title" />
      <div class="project-cover__overlay">
        <header class="project-header" ref="headerRef">
          <div class="project-header__meta">
            <p class="project-header__cat cat-tag">{{ project.category }}</p>
            <span class="project-header__year">{{ project.year }}</span>
            <span class="project-header__role">{{ project.role }}</span>
          </div>
          <h1 class="project-header__title">{{ project.title }}</h1>
        </header>
      </div>
    </div>

    <!-- CONTENU -->
    <div class="project-main-content">
      <!-- Zone 2 colonnes : description + specs -->
      <div class="project-top">
        <section class="content-block">
          <h2 id="project-title">{{ lang.project.theProject }}</h2>
          <p>{{ project.description }}</p>
        </section>

        <aside class="col-specs">
          <div class="specs-card">
            <div class="spec-item">
              <span class="spec-label">{{ lang.project.year }}</span>
              <span class="spec-value">{{ project.year }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">{{ lang.project.role }}</span>
              <span class="spec-value">{{ project.role }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">{{ lang.project.stack }}</span>
              <ul class="stack-list">
                <li
                  v-for="tech in project.stack"
                  :key="tech"
                  class="stack-item"
                >
                  <Icon
                    :name="`simple-icons:${tech}`"
                    size="20"
                    class="stack__icon"
                  />
                  <span class="stack__name">{{ tech }}</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <!-- Zone pleine largeur -->
      <div class="project-bottom">

        <!-- Objectifs + Skills en 2 colonnes -->
        <div class="project-row-2col">
          <section class="content-block" v-if="project.objectif">
            <h2><Icon name="lucide:target" />{{ lang.project.objectives }}</h2>
            <ul class="styled-list">
              <li v-for="(obj, index) in project.objectif" :key="index">
                {{ obj }}
              </li>
            </ul>
          </section>

          <section class="content-block" v-if="project.Compétence">
            <h2><Icon name="lucide:wrench" />{{ lang.project.skills }}</h2>
            <ul class="styled-list">
              <li v-for="(comp, index) in project.Compétence" :key="index">
                {{ comp }}
              </li>
            </ul>
          </section>
        </div>

        <!-- Résultats + gif -->
        <section class="content-block" v-if="project.résultat">
          <h2><Icon name="lucide:check-circle" />{{ lang.project.result }}</h2>
          <div class="resultat-inner">
            <p>{{ project.résultat }}</p>
            <div v-if="project.gif" class="objectif-gif-wrapper">
              <img :src="project.gif" :alt="project.title" class="objectif-gif" />
            </div>
          </div>
        </section>

        <section class="content-block" v-if="project.Amélioration">
          <h2><Icon name="lucide:lightbulb" />{{ lang.project.improvements }}</h2>
          <ul class="styled-list">
            <li v-for="(item, index) in project.Amélioration" :key="index">
              {{ item }}
            </li>
          </ul>
        </section>

        <a :href="project.link" target="_blank" class="external-link">
          {{ lang.project.visitSite }}
        </a>
      </div>
    </div>

    <!-- NAVIGATION PROJETS -->
    <div class="project-navigation">
      <button
        class="nav-project-btn prev-btn"
        @click="goToPrevProject"
        :disabled="!prevProject"
        :style="prevProject ? `--thumb: url('${prevProject.image}')` : ''"
      >
        <span>{{ lang.project.prev }}</span>
      </button>
      <button
        class="nav-project-btn next-btn"
        @click="goToNextProject"
        :disabled="!nextProject"
        :style="nextProject ? `--thumb: url('${nextProject.image}')` : ''"
      >
        <span>{{ lang.project.next }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import langData from "@/data/lang.json";
import projectsData from "@/data/projects.json";
import { useThemeStore } from "@/stores/useThemeStore";

const themeStore = useThemeStore();

const { locale } = useI18n({ useScope: "global" });
const lang = computed(
  () => langData[locale.value.startsWith("fr") ? "fr" : "en"],
);

const route = useRoute();
const router = useRouter();

const projectId = route.params.id;
const project = projectsData.find((p) => p.id === projectId);
if (!project) {
  throw createError({ statusCode: 404, statusMessage: "Projet introuvable" });
}
const currentIndex = projectsData.findIndex((p) => p.id === projectId);
const safeIndex = currentIndex === -1 ? 0 : currentIndex;

const prevProject = safeIndex > 0 ? projectsData[safeIndex - 1] : null;
const nextProject =
  safeIndex < projectsData.length - 1 ? projectsData[safeIndex + 1] : null;

const goToPrevProject = () => {
  if (prevProject) router.push(`/projects/${prevProject.id}`);
};
const goToNextProject = () => {
  if (nextProject) router.push(`/projects/${nextProject.id}`);
};

const navScrolled = ref(false);
const coverRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const { $gsap } = useNuxtApp();

  // Parallaxe + détection scroll
  const coverImg = coverRef.value?.querySelector("img") as HTMLElement | null;
  const onScroll = () => {
    const coverHeight = coverRef.value?.offsetHeight ?? 0;
    navScrolled.value = window.scrollY > coverHeight;
    if (coverImg)
      coverImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onUnmounted(() => window.removeEventListener("scroll", onScroll));

  // Animation d'entrée cover
  const tl = $gsap.timeline({ delay: 0.3 });
  tl.from(coverImg, { scale: 1.1, duration: 1.2, ease: "power3.out" })
    .from(
      headerRef.value?.querySelectorAll(".project-header__meta > *") ?? [],
      {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.5",
    )
    .from(
      ".project-header__title",
      {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.3",
    );

  // Animations scroll sur les content-block
  $gsap.utils.toArray<HTMLElement>(".content-block").forEach((block) => {
    $gsap.from(block, {
      scrollTrigger: {
        trigger: block,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    });
  });

  // Animation col-specs
  $gsap.from(".col-specs", {
    scrollTrigger: { trigger: ".col-specs", start: "top 85%" },
    y: 30,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
  });
});
</script>
