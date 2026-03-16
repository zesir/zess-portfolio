<template>
  <button
    class="lang-switcher"
    @click="handleToggle"
    ref="btnRef"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :style="{
      borderColor: isHovered
        ? themeStore.accentColor
        : 'rgba(237, 235, 230, 0.2)',
      color: isHovered ? themeStore.accentColor : '#edebe6',
    }"
  >
    <div class="inner-text" ref="textRef">
      {{ langStore.locale.toUpperCase() }}
    </div>
  </button>
</template>

<script setup lang="ts">
import { useLangStore } from "@/stores/useLangStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { ref } from "vue";

const langStore = useLangStore();
const themeStore = useThemeStore();
const { $gsap } = useNuxtApp();

const btnRef = ref(null);
const textRef = ref(null);
const isHovered = ref(false);

const handleToggle = () => {
  $gsap.to(textRef.value, {
    y: -20,
    opacity: 0,
    duration: 0.2,
    ease: "power2.in",
    onComplete: () => {
      langStore.toggleLang();
      $gsap.fromTo(
        textRef.value,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
      );
    },
  });

  $gsap.fromTo(
    btnRef.value,
    { scale: 0.9 },
    { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" },
  );
};
</script>

<style scoped lang="scss">
.lang-switcher {
  position: fixed;
  top: 40px;
  left: 40px;
  z-index: 9999;

  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(237, 235, 230, 0.2);
  background: transparent;
  color: #edebe6;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;

  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
  font-weight: bold;

  transition:
    border-color 0.4s ease,
    color 0.4s ease,
    transform 0.3s ease;

  &:hover {
    background: rgba(237, 235, 230, 0.05);
  }
}

.inner-text {
  display: block;
}
</style>
