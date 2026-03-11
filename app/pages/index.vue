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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLangStore } from "@/stores/useLangStore";
import { computed, nextTick, onMounted, ref } from "vue";

const { $gsap } = useNuxtApp();
const langStore = useLangStore();

// 1. REFs des sections
const scrollWrapper = ref<HTMLElement | null>(null);
const heroSection = ref<any>(null);
const andYouSection = ref<any>(null);
const welcomeSection = ref<any>(null);

// 2. État de la navigation
const steps = computed(() => langStore.t.nav.slice(0, 3));
const currentStep = ref(0);
const scrollProgress = ref(0);
let mainTl: gsap.core.Timeline;

// 3. Labels strictement définis
const SECTION_LABELS = ["start", "step-identity", "step-welcome"];

onMounted(async () => {
  await nextTick();
  if (!$gsap || !scrollWrapper.value) return;

  const s = [
    heroSection.value?.$el,
    andYouSection.value?.$el,
    welcomeSection.value?.$el,
  ];

  $gsap.set(s.slice(1), { autoAlpha: 0, yPercent: 100 });

  mainTl = $gsap.timeline({
    scrollTrigger: {
      trigger: scrollWrapper.value,
      start: "top top",
      end: "+=400%",
      scrub: 1,
      pin: true,
      onUpdate: (self) => {
        scrollProgress.value = self.progress * 100;

        // Détection par paliers  (33% par section)
        if (self.progress > 0.8) {
          currentStep.value = 2;
        } else if (self.progress > 0.3) {
          currentStep.value = 1;
        } else {
          currentStep.value = 0;
        }
      },
    },
  });

  mainTl
    .addLabel(SECTION_LABELS[0]!)
    .to({}, { duration: 1 }) // Pause sur Hero

    .to(s[0], { yPercent: -100, autoAlpha: 0, duration: 2 })
    .fromTo(
      s[1],
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 2 },
      "<",
    )
    .addLabel(SECTION_LABELS[1]!)
    .to({}, { duration: 1 }) // Pause sur Identity

    .to(s[1], { yPercent: -100, autoAlpha: 0, duration: 2 })
    .fromTo(
      s[2],
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 2 },
      "<",
    )
    .addLabel(SECTION_LABELS[2]!);
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

const handleValidation = () => goToSection(2);
</script>
