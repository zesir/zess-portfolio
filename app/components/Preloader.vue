<template>
  <div v-if="visible" class="preloader">
    <div ref="panelLeft" class="preloader__panel preloader__panel--left" />
    <div ref="panelRight" class="preloader__panel preloader__panel--right" />
    <div ref="lottieContainer" class="preloader__lottie" />
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import lottie from "lottie-web";

const visible = ref(true);
const panelLeft = ref<HTMLElement | null>(null);
const panelRight = ref<HTMLElement | null>(null);
const lottieContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  // Uniquement au premier chargement
  if (sessionStorage.getItem("preloader_done")) {
    visible.value = false;
    return;
  }

  // Charger et jouer l'animation Lottie
  const anim = lottie.loadAnimation({
    container: lottieContainer.value!,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: "/data.json",
  });

  // Attendre la fin de l'animation Lottie puis déclencher la sortie
  anim.addEventListener("complete", () => {
    exitPreloader();
  });
});

function exitPreloader() {
  const tl = gsap.timeline({
    onComplete: () => {
      visible.value = false;
      sessionStorage.setItem("preloader_done", "1");
    },
  });

  // Fade out du Lottie
  tl.to(lottieContainer.value, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
  });

  // Les deux panneaux s'écartent
  tl.to(
    panelLeft.value,
    { x: "-100%", duration: 0.8, ease: "power3.inOut" },
    "-=0.1",
  ).to(
    panelRight.value,
    { x: "100%", duration: 0.8, ease: "power3.inOut" },
    "<",
  );
}
</script>

<style scoped lang="scss">
.preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;

  &__panel {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    background-color: #111111;

    &--left {
      left: 0;
    }
    &--right {
      right: 0;
    }
  }

  &__lottie {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    z-index: 1;
  }
}
</style>
