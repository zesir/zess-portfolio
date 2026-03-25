<template>
  <div class="cursor-wrapper" v-if="isClient">
    <div
      class="cursor-dot"
      ref="dot"
      :style="{ backgroundColor: themeStore.accentColor }"
    ></div>
    <div
      class="cursor-ring"
      ref="ring"
      :style="{ borderColor: themeStore.accentColor }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/stores/useThemeStore";
import { onMounted, onUnmounted, ref } from "vue";

const themeStore = useThemeStore();
const { $gsap } = useNuxtApp();

const dot = ref<HTMLElement | null>(null);
const ring = ref<HTMLElement | null>(null);

const isClient = ref(false);

onMounted(() => {
  // ✅ On n'active le curseur que si la souris est détectée
  if (window.matchMedia("(pointer: fine)").matches) {
    isClient.value = true;

    const moveCursor = (e: MouseEvent) => {
      if (!dot.value || !ring.value) return;

      $gsap.to(dot.value, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });

      $gsap.to(ring.value, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "elastic.out(1, 0.5)",
      });
    };

    window.addEventListener("mousemove", moveCursor);

    onUnmounted(() => {
      window.removeEventListener("mousemove", moveCursor);
    });
  }
});
</script>
<style scoped>
.cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
}

.cursor-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px; /* Centrage */
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.cursor-ring {
  position: fixed;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px; /* Centrage */
  border: 1.5px solid;
  border-radius: 50%;
  transition:
    transform 0.3s ease,
    width 0.3s ease,
    height 0.3s ease;
}
</style>
