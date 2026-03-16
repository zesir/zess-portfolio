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
    <div class="transition-curtain" ref="curtain"></div>
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

  if (s.some((el) => !el)) {
    console.error("Une section est introuvable :", s);
    return;
  }

  $gsap.set(s.slice(1), { autoAlpha: 0, yPercent: 100 });

  const lines = s[3].querySelectorAll(".reveal-line");
  console.log("Nombre de lignes trouvées :", lines.length);

  mainTl = $gsap.timeline({
    scrollTrigger: {
      trigger: scrollWrapper.value,
      start: "top top",
      end: "+=1200%",
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const totalTime = mainTl.totalDuration();
        const bioLabelTime = mainTl.labels[SECTION_LABELS[3]!] ?? totalTime;
        const welcomeLabelTime = mainTl.labels[SECTION_LABELS[2]!] ?? 0;
        const identityLabelTime = mainTl.labels[SECTION_LABELS[1]!] ?? 0;

        //  BARRE DE PROGRESSION
        const targetRatio = bioLabelTime / totalTime;
        let p = (self.progress / targetRatio) * 100;
        scrollProgress.value = Math.min(p, 100);

        // ILLUMINATION DES POINTS
        const currentPos = mainTl.time();

        if (currentPos >= bioLabelTime - 0.2) {
          currentStep.value = 3;
        } else if (currentPos >= welcomeLabelTime - 0.2) {
          currentStep.value = 2;
        } else if (currentPos >= identityLabelTime - 0.2) {
          currentStep.value = 1;
        } else {
          currentStep.value = 0;
        }
      },
    },
  });

  // Construction de la Timeline
  mainTl
    .addLabel(SECTION_LABELS[0]!)
    .to({}, { duration: 1 })
    // Transitions Hero -> Identity -> Welcome
    .to(s[0], { yPercent: -100, autoAlpha: 0, duration: 2 })
    .fromTo(
      s[1],
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 2 },
      "<",
    )
    .addLabel(SECTION_LABELS[1]!)
    .to({}, { duration: 1 })
    .to(s[1], { yPercent: -100, autoAlpha: 0, duration: 2 })
    .fromTo(
      s[2],
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 2 },
      "<",
    )
    .addLabel(SECTION_LABELS[2]!)
    .to({}, { duration: 1 })

    // Transition Welcome -> Bio
    .to(s[2], { yPercent: -100, autoAlpha: 0, duration: 2 })
    .fromTo(
      s[3],
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 2 },
      "<",
    )
    .addLabel(SECTION_LABELS[3]!);
  // Récupération des éléments exposés par BioSection.vue
  const bioGridEl = bioSection.value?.bioGrid;
  const bioLinesEl = bioSection.value?.allLines;

  if (bioGridEl && bioLinesEl) {
    const vh = window.innerHeight;
    const totalDuration = 10;

    // 1. Reveal
    mainTl
      .fromTo(
        bioGridEl,
        { y: "50vh" },
        {
          y: () => -(bioGridEl.offsetHeight - vh * 0.7),
          duration: totalDuration,
          ease: "none",
        },
        "<",
      )
      .fromTo(
        bioLinesEl,
        { autoAlpha: 0.1 },
        {
          autoAlpha: 1,
          stagger: { amount: totalDuration * 0.8 },
          duration: 1.5,
          ease: "power2.out",
        },
        "<",
      );

    // Transition mes projets
    mainTl

      .fromTo(
        curtain.value,
        { y: vh },
        { y: vh * 0.6, duration: 0.8, ease: "power2.in" },
      )

      // LE COLLAGE IMMÉDIAT

      .to(curtain.value, {
        y: 0,
        duration: 2,
        ease: "none",
      })
      .to(
        bioGridEl,
        {
          y: `-=${vh * 0.6}`, // On parcourt exactement la même distance que le rideau
          autoAlpha: 0,
          duration: 2,
          ease: "none",
        },
        "<",
      );
  }
  await nextTick();

  if (projectSection.value) {
    $gsap.set(projectSection.value.$el, { autoAlpha: 0 });
  }

  //  fin timeline bio

  // LA TRANSITION HORIZONTALE
  if (projectSection.value && curtain.value) {
    const slideEl = projectSection.value.projectsSlide;
    const interceptorEl = projectSection.value.interceptor;
    const cards = slideEl.querySelectorAll(".project-card");

    const getScrollAmount = () => {
      let slideWidth = slideEl.scrollWidth;
      return -(slideWidth - window.innerWidth);
    };

    mainTl

      .addLabel("step-projects")
      .to(scrollWrapper.value, {
        "--vignette-opacity": 0,
        duration: 0.6,
        ease: "power2.inOut",
      })
      .set(curtain.value, { zIndex: 5 })
      .to(projectSection.value.$el, {
        autoAlpha: 1,
        duration: 1,
      })

      // B. Apparition des cartes une par une (stagger)
      .fromTo(
        cards,
        {
          autoAlpha: 0,
          x: 100,
          scale: 0.9,
        },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          stagger: 0.2,
          duration: 1,
          ease: "power2.out",
        },
        "+=0.2",
      )

      // C. LE SCROLL HORIZONTAL
      .to(slideEl, {
        x: getScrollAmount,
        ease: "none",
        duration: 4,
      });

    mainTl.to({}, { duration: 1 });
  }
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
