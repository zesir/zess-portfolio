<template>
  <section class="hero section" ref="hero">
    <div class="intro" ref="intro">
      <h1 class="intro__title" ref="title">
        {{ lang.heroTitle }}
        <strong :style="{ color: themeStore.accentColor }">Zess</strong>
      </h1>
      <h2 class="intro__subtitle" ref="subtitle">{{ lang.hero }}</h2>
    </div>
  </section>
</template>

<script setup lang="ts">
import langData from "@/data/lang.json";
import { useThemeStore } from "@/stores/useThemeStore";

const { locale } = useI18n({ useScope: 'global' });
const lang = computed(() => langData[locale.value.startsWith('fr') ? 'fr' : 'en']);
const themeStore = useThemeStore();

const { $gsap } = useNuxtApp();

const title = ref<HTMLElement | null>(null);
const subtitle = ref<HTMLElement | null>(null);
const hero = ref<HTMLElement | null>(null);
const intro = ref<HTMLElement | null>(null);

defineExpose({
  hero,
  intro,
  title,
  subtitle,
});

let handleMouseMove: ((e: MouseEvent) => void) | null = null;

onMounted(async () => {
  await nextTick();

  if (!$gsap || !title.value || !subtitle.value) return;

  handleMouseMove = (e: MouseEvent) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    $gsap.to(title.value, {
      x: mouseX * 60,
      y: mouseY * 60,
      rotateX: -mouseY * 25,
      rotateY: mouseX * 25,
      duration: 0.8,
      ease: "power3.out",
    });

    $gsap.to(subtitle.value, {
      x: mouseX * 35,
      y: mouseY * 35,
      rotateX: -mouseY * 15,
      rotateY: mouseX * 15,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  if (handleMouseMove) window.removeEventListener("mousemove", handleMouseMove);
});
</script>
