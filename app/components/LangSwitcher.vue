<template>
  <button
    v-if="!isProjectPage"
    class="lang-switcher"
    @click="handleToggle"
    ref="btnRef"
    :aria-label="`${locale === 'fr' ? 'Switch to English' : 'Passer en français'}`"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focus="isHovered = true"
    @blur="isHovered = false"
    :style="{
      borderColor: isHovered
        ? themeStore.accentColor
        : 'rgba(237, 235, 230, 0.2)',
      color: isHovered ? themeStore.accentColor : '#edebe6',
    }"
  >
    <div class="inner-text" ref="textRef">
      {{ locale.toUpperCase() }}
    </div>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/stores/useThemeStore";
import { ref } from "vue";

const { locale } = useI18n({ useScope: 'global' });
const localeCookie = useCookie('locale');
const themeStore = useThemeStore();
const route = useRoute();
const isProjectPage = computed(() => route.path.startsWith('/projects/'));
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
      const newLocale = locale.value === "en" ? "fr" : "en";
      locale.value = newLocale as "en" | "fr";
      localeCookie.value = newLocale;
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
