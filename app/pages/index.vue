<template>
  <main class="main-layout" :style="ready ? {} : { opacity: 0 }">
    <ClientOnly>
      <VerticalNav
        :steps="steps"
        :current-step="currentStep"
        :progress="scrollProgress"
        @go-to="goToSection"
      />
    </ClientOnly>
    <MobileNav :steps="steps" @go-to="goToSection" />

    <div ref="scrollWrapper" class="scroll-wrapper">
      <HeroSection ref="heroSection" />
      <AndYouSection ref="andYouSection" @validated="handleValidation" />
      <Welcome ref="welcomeSection" />
      <BioSection ref="bioSection" />
      <ProjectSection ref="projectSection" />
    </div>
    <ContactSection ref="contactSection" />
  </main>
</template>

<script setup lang="ts">
import MobileNav from "@/components/MobileNav.vue";
import langData from "@/data/lang.json";
import { useThemeStore } from "@/stores/useThemeStore";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";

const { $gsap, $ScrollTrigger } = useNuxtApp();
const { locale } = useI18n({ useScope: "global" });
const themeStore = useThemeStore();

useSeoMeta({
  title: "Zess — Creative Developer",
  description:
    "Portfolio of Zess, a Creative Developer crafting immersive digital experiences with modern web technologies.",
  ogTitle: "Zess — Creative Developer",
  ogDescription:
    "Portfolio of Zess, a Creative Developer crafting immersive digital experiences with modern web technologies.",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Zess — Creative Developer",
  twitterDescription:
    "Portfolio of Zess, a Creative Developer crafting immersive digital experiences with modern web technologies.",
});

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
const contactSection = ref<any>(null);

const steps = computed(
  () => langData[locale.value.startsWith("fr") ? "fr" : "en"].nav,
);
const currentStep = ref(0);
const scrollProgress = ref(0);
let mainTl: gsap.core.Timeline;
let navLabels: string[] = [];

const route = useRoute();
const router = useRouter();
const ready = ref(false);

onUnmounted(() => {
  mainTl?.scrollTrigger?.kill();
  mainTl?.kill();
});

const SECTION_LABELS = [
  "start",
  "step-identity",
  "step-welcome",
  "step-about",
  "step-projects",
  "step-contact",
];

onMounted(async () => {
  if (!route.query.step) window.scrollTo(0, 0);

  await nextTick();
  // Attendre la fin de la transition de page (0.6s) avant que GSAP mesure les dimensions
  await new Promise((resolve) => setTimeout(resolve, 650));
  if (!route.query.step) window.scrollTo(0, 0);

  if (!$gsap || !scrollWrapper.value) return;

  const s = [
    heroSection.value?.$el,
    andYouSection.value?.$el,
    welcomeSection.value?.$el,
    bioSection.value?.$el,
  ];

  const bioGridEl = bioSection.value?.bioGrid;
  const bioLinesEl = bioSection.value?.$el
    ? Array.from(bioSection.value.$el.querySelectorAll(".reveal-line"))
    : [];

  if (s.some((el) => !el)) return;

  // --- 1. CONFIGURATION DES PALIERS AVEC "DEAD ZONE" ---
  const moveDur = 10; // Durée du mouvement pur
  const stayDur = 6; // Le "un peu plus" (zone de repos 50px+)
  const step = moveDur + stayDur; // Chaque bloc fait maintenant 16 unités

  const p0 = 0;
  const p1 = step; // 16
  const p2 = step * 2; // 32
  const p3 = step * 3; // 48
  const p4 = step * 4; // 64

  $gsap.set(s.slice(1), { autoAlpha: 0, yPercent: 100 });

  // sectionTimes est rempli après construction de la timeline
  let sectionTimes: number[] = [];

  mainTl = $gsap.timeline({
    scrollTrigger: {
      trigger: scrollWrapper.value,
      start: "top top",
      end: "+=1600%",
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // self.progress = position scroll réelle sans lag scrub
        const currentPos = self.progress * mainTl.totalDuration();

        // ILLUMINATION — temps exacts issus des labels GSAP
        let active = 0;
        for (let i = sectionTimes.length - 1; i >= 0; i--) {
          if (currentPos >= (sectionTimes[i] ?? 0)) {
            active = i;
            break;
          }
        }
        currentStep.value = active;

        // BARRE DE PROGRESSION — normalisée sur tous les dots (y compris contact)
        const totalGaps = SECTION_LABELS.length - 1;
        if (totalGaps <= 0) {
          scrollProgress.value = 0;
          return;
        }

        const fromTime = sectionTimes[active] ?? 0;
        const toTime = sectionTimes[active + 1] ?? null;

        const fraction =
          toTime !== null && toTime > fromTime
            ? Math.min(1, (currentPos - fromTime) / (toTime - fromTime))
            : 0;

        scrollProgress.value = ((active + fraction) / totalGaps) * 100;
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
  if (bioGridEl && bioLinesEl.length) {
    mainTl.fromTo(
      bioGridEl,
      { y: "50vh" },
      {
        y: () => -(bioGridEl.offsetHeight - window.innerHeight * 0.7),
        duration: moveDur + stayDur,
        ease: "none",
      },
      p3,
    );

    mainTl.fromTo(
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
    const stickyContainer = sectionEl.querySelector(
      ".projects-sticky-container",
    ) as HTMLElement;

    $gsap.set(sectionEl, {
      autoAlpha: 1,
      yPercent: 100,
      zIndex: 100,
      scale: 0.8,
      borderRadius: 80,
    });
    // Compensation du drift dû à transform-origin: left center (scale grossit vers la droite)
    const titleW = projectTitle.offsetWidth;
    const xReveal = -(titleW * 0.1); // (scale 1.2 - 1) / 2 * width
    $gsap.set(projectTitle, {
      x: -(titleW * 0.25),
      xPercent: 0,
      autoAlpha: 0,
      scale: 1.5,
    });
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
        { autoAlpha: 1, x: xReveal, xPercent: 0, scale: 1.2, duration: 2 },
        "-=3.5",
      )
      // Label déclenché quand la section est montée, avant l'apparition des cartes
      .addLabel("step-projects-ready")
      .to(
        projectTitle,
        {
          rotation: -90,
          scale: 0.4,
          x: "-5vw",
          y: "20vh",
          lineHeight: "7rem",
          duration: 4,
          ease: "expo.inOut",
          opacity: 0,
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
      )
      .to(
        stickyContainer,
        {
          backgroundColor: () => themeStore.backgroundColor,
          ease: "none",
          duration: 20,
          onStart: () => stickyContainer.classList.add("is-dark"),
          onReverseComplete: () => stickyContainer.classList.remove("is-dark"),
        },
        "<",
      );
  }

  mainTl.to({}, { duration: 1 });

  // Lecture des temps exacts des labels après construction complète
  // Pour le point projets, on utilise "step-projects-ready" (section montée, avant scroll horizontal)
  navLabels = [...SECTION_LABELS];
  navLabels[4] = "step-projects-ready";
  // step-contact est hors timeline — on lui attribue totalDuration comme borne
  sectionTimes = navLabels
    .filter((l) => l !== "step-contact")
    .map((label) => mainTl.labels[label] ?? 0);

  // ScrollTrigger séparé pour la section contact (hors scroll pincé)
  const contactEl = contactSection.value?.contactRef;
  if (contactEl) {
    $gsap.from(contactEl, {
      scrollTrigger: {
        trigger: contactEl,
        start: "top 80%",
        onEnter: () => {
          currentStep.value = 5;
          scrollProgress.value = 100;
        },
        onLeaveBack: () => {
          currentStep.value = 4;
          scrollProgress.value =
            ((SECTION_LABELS.length - 2) / (SECTION_LABELS.length - 1)) * 100;
        },
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  const stepParam = Number(route.query.step);
  if (!isNaN(stepParam) && stepParam > 0) {
    const targetLabel = navLabels[stepParam] ?? SECTION_LABELS[stepParam];
    if (targetLabel && mainTl?.scrollTrigger) {
      $ScrollTrigger.refresh();
      const targetTime = mainTl.labels[targetLabel] ?? 0;
      const st = mainTl.scrollTrigger;
      const targetScroll =
        st.start + (targetTime / mainTl.totalDuration()) * (st.end - st.start);
      mainTl.seek(targetTime);
      window.scrollTo(0, targetScroll);
    }
    router.replace("/");
  } else {
    window.scrollTo(0, 0);
    $ScrollTrigger.refresh();
    mainTl.seek(0);
  }
  ready.value = true;
});

watch(
  () => themeStore.backgroundColor,
  () => {
    if (!mainTl) return;
    mainTl.scrollTrigger?.update();
  },
);

const goToSection = (index: number) => {
  if (!mainTl?.scrollTrigger) return;

  // Contact section — hors du scroll pincé
  if (index === 5) {
    const contactEl = contactSection.value?.contactRef;
    if (contactEl) {
      $gsap.to(window, {
        scrollTo: { y: contactEl, autoKill: false },
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
    return;
  }

  const targetLabel = navLabels[index] ?? SECTION_LABELS[index];
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
