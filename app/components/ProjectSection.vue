<template>
  <section class="projects-section" ref="interceptor">
    <div class="projects-sticky-container">
      <div class="projects-slide" ref="projectsSlide">
        <div class="projects-header">
          <h2>Mes<br />Projets</h2>
        </div>

        <div
          v-for="(project, index) in projects"
          :key="index"
          class="project-card"
          @click="goToProject(project.id)"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          <div class="card-content">
            <div class="image-placeholder">
              <span>0{{ index + 1 }}</span>
            </div>
            <div class="card-info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.category }}</p>
            </div>
          </div>
        </div>

        <div class="projects-spacer"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { $gsap } = useNuxtApp();

const interceptor = ref(null);
const projectsSlide = ref(null);
const projects = [
  { id: "p1", title: "Projet Alpha", category: "Web Design" },
  { id: "p2", title: "Projet Beta", category: "Développement" },
  { id: "p3", title: "Projet Gamma", category: "UI/UX" },
  { id: "p4", title: "Projet Delta", category: "Mobile App" },
];

const router = useRouter();
const goToProject = (id: string) => {
  router.push(`/projects/${id}`);
};

const onMouseEnter = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  $gsap.to(target, {
    y: -20,
    scale: 1.02,
    rotation: -3,
    duration: 0.8,
    ease: "elastic.out",
    overwrite: true,
  });
};

const onMouseLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  $gsap.to(target, {
    y: 0,
    scale: 1,
    rotation: 0,
    duration: 0.8,
    ease: "elastic.out",
    overwrite: true,
  });
};

defineExpose({ interceptor, projectsSlide });
</script>
