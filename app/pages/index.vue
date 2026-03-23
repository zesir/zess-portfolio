<template>
  <div class="main-layout">
    <VerticalNav
      :steps="steps"
      :current-step="currentStep"
      :progress="scrollProgress"
      @go-to="goToSection"
    />

    <div ref="scrollWrapper" class="scroll-wrapper">
      <HeroSection ref="heroSection" />
      <AndYouSection ref="andYouSection" @validated="handleValidation" />
      <Welcome ref="welcomeSection" />
      <BioSection ref="bioSection" />
      <ProjectSection ref="projectSection" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLangStore } from "@/stores/useLangStore";
import { useThemeStore } from "@/stores/useThemeStore"; // L'import

import { computed, nextTick, onMounted, ref } from "vue";

const { $gsap } = useNuxtApp();
const langStore = useLangStore();
const themeStore = useThemeStore(); // L'instanciation

const scrollWrapper = ref<HTMLElement | null>(null);
const heroSection = ref<any>(null);
const andYouSection = ref<any>(null);
const welcomeSection = ref<any>(null);
const bioSection = ref<any>(null);
const curtain = ref(null);
interface ProjectSectionInstance {
  $el: HTMLElement;
  projectsSlide: HTMLElement;
  interceptor: HTMLElement;
}

// On applique ce type à la ref
const projectSection = ref<ProjectSectionInstance | null>(null);

const steps = computed(() => langStore.t.nav);
const currentStep = ref(0);
const scrollProgress = ref(0);
let mainTl: gsap.core.Timeline;

const SECTION_LABELS = [
  "start",
  "step-identity",
  "step-welcome",
  "step-about",
  "step-projects",
];

onMounted(async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!$gsap || !scrollWrapper.value) return;

  const s = [
    heroSection.value?.$el,
    andYouSection.value?.$el,
    welcomeSection.value?.$el,
    bioSection.value?.$el,
  ];

  const bioGridEl = bioSection.value?.bioGrid;
  const bioLinesEl = bioSection.value?.allLines;

  if (s.some((el) => !el)) return;

  // --- 1. CONFIGURATION DES PALIERS AVEC "DEAD ZONE" ---
  const moveDur = 10; // Durée du mouvement pur
  const stayDur = 6; // Le "un peu plus" (zone de repos 50px+)
  const step = moveDur + stayDur; // Chaque bloc fait maintenant 16 unités

  const p0 = 0;
  const p1 = step; // 16
  const p2 = step * 2; // 32
  const p3 = step * 3; // 48
  const p4 = step * 4; // 64 (100% de la barre)

  $gsap.set(s.slice(1), { autoAlpha: 0, yPercent: 100 });

  mainTl = $gsap.timeline({
    scrollTrigger: {
      trigger: scrollWrapper.value,
      start: "top top",
      end: "+=1600%", // Augmenté pour compenser l'ajout de durée
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const currentPos = mainTl.time();

        // ILLUMINATION DES POINTS
        // On utilise une marge de -1 pour que le point s'allume quand on est "bien arrivé"
        if (currentPos >= p4 - 1) currentStep.value = 4;
        else if (currentPos >= p3 - 1) currentStep.value = 3;
        else if (currentPos >= p2 - 1) currentStep.value = 2;
        else if (currentPos >= p1 - 1) currentStep.value = 1;
        else currentStep.value = 0;

        // BARRE DE PROGRESSION
        scrollProgress.value = Math.min((currentPos / p4) * 100, 100);
      },
    },
  });

  // --- 2. CONSTRUCTION DE LA TIMELINE ---

  mainTl.addLabel(SECTION_LABELS[0]!, p0);

  // Transition Hero -> Identity (Arrive à 16)
  mainTl
    .to(s[0], { yPercent: -100, autoAlpha: 0, duration: moveDur })
    .fromTo(
      s[1],
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: moveDur },
      "<",
    )
    .to({}, { duration: stayDur }) // <-- Les pixels de rab
    .addLabel(SECTION_LABELS[1]!, p1);

  // Transition Identity -> Welcome (Arrive à 32)
  mainTl
    .to(s[1], { yPercent: -100, autoAlpha: 0, duration: moveDur })
    .fromTo(
      s[2],
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: moveDur },
      "<",
    )
    .to({}, { duration: stayDur }) // <-- Les pixels de rab
    .addLabel(SECTION_LABELS[2]!, p2);

  // Transition Welcome -> Bio (Arrive à 48)
  mainTl
    .to(s[2], { yPercent: -100, autoAlpha: 0, duration: moveDur })
    .fromTo(
      s[3],
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: moveDur },
      "<",
    )
    .to({}, { duration: stayDur }) // <-- Les pixels de rab
    .addLabel(SECTION_LABELS[3]!, p3);

  // Transition Bio Scroll Interne (48 -> 64)
  if (bioGridEl && bioLinesEl) {
    mainTl
      .fromTo(
        bioGridEl,
        { y: "50vh" },
        {
          y: () => -(bioGridEl.offsetHeight - window.innerHeight * 0.7),
          duration: moveDur + stayDur,
          ease: "none",
        },
        p3,
      )

      .fromTo(
        bioLinesEl,
        { autoAlpha: 0.1 },
        {
          autoAlpha: 1,
          stagger: { amount: (moveDur + stayDur) * 0.8 },
          duration: 2,
          ease: "power2.out",
        },
        p3,
      );
  }

  // --- 3. SECTION PROJETS (Position 64) ---
  mainTl.addLabel(SECTION_LABELS[4]!, p4);

  if (projectSection.value) {
    const sectionEl = projectSection.value.$el;
    const slideEl = projectSection.value.projectsSlide;
    const cards = slideEl.querySelectorAll(".project-card");
    const allImages = slideEl.querySelectorAll(".project-img");
    const projectTitle = sectionEl.querySelector(".projectsTitle");

    $gsap.set(sectionEl, {
      autoAlpha: 1,
      yPercent: 100,
      zIndex: 100,
      scale: 0.8,
      borderRadius: 80,
    });
    $gsap.set(projectTitle, { xPercent: 20, autoAlpha: 0, scale: 1.5 });
    $gsap.set(cards, { autoAlpha: 0, x: 100 });

    mainTl
      // Montée
      .to(
        sectionEl,
        {
          yPercent: 0,
          duration: 10,
          scale: 1,
          borderRadius: 0,
          ease: "power2.inOut",
        },
        p4,
      )
      .to(s[3], { autoAlpha: 0, scale: 0.9, duration: 5 }, p4)

      // Reveal Titre et Fade-in des Cards
      .to(
        projectTitle,
        { autoAlpha: 1, xPercent: 0, scale: 1.2, duration: 2 },
        "-=3.5",
      )
      .to(
        projectTitle,
        {
          rotation: -90,
          scale: 0.4,
          x: "-5vw",
          y: "20vh",
          duration: 4,
          ease: "expo.inOut",
        },
        "-=0.5",
      )
      .to(
        cards,
        { autoAlpha: 1, x: 0, stagger: 0.2, duration: 1.5, ease: "power2.out" },
        "-=1",
      )

      // Scroll Horizontal + Parallaxe
      .to(slideEl, {
        x: () => -(slideEl.scrollWidth - window.innerWidth),
        ease: "none",
        duration: 20,
      })
      .fromTo(
        allImages,
        { xPercent: 15 },
        {
          xPercent: -15,
          ease: "none",
          stagger: { each: 0.5 },
          duration: 20,
        },
        "<",
      );
  }

  mainTl.to({}, { duration: 1 });
});

const goToSection = (index: number) => {
  if (!mainTl?.scrollTrigger) return;
  const targetLabel = SECTION_LABELS[index];
  if (!targetLabel) return;

  const targetScroll = mainTl.scrollTrigger.labelToScroll(targetLabel);

  $gsap.to(window, {
    scrollTo: { y: targetScroll, autoKill: false },
    duration: 1.2,
    ease: "power2.inOut",
  });
};

// index.vue
const handleValidation = () => {
  if (!mainTl || !mainTl.scrollTrigger) {
    console.error("La Timeline GSAP n'est pas initialisée");
    return;
  }

  const targetLabel = "step-welcome";
  const targetScroll = mainTl.scrollTrigger.labelToScroll(targetLabel);

  $gsap.to(window, {
    scrollTo: { y: targetScroll, autoKill: false },
    duration: 1.2,
    ease: "power2.inOut",
    onComplete: () => {
      console.log("Arrivé sur Welcome ! Activation de l'animation...");
      themeStore.nameValidated = true;
    },
  });
};
</script>
