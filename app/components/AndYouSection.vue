<template>
  <section class="and-you section" ref="andYou">
    <h2 class="section-title">{{ lang.identity.title }}</h2>
    <form class="form">
      <input
        type="text"
        :placeholder="lang.identity.placeholder"
        v-model="themeStore.visitorName"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown.enter.prevent="validateName"
        :style="{
          borderColor: isFocused ? themeStore.accentColor : '#edebe6',
        }"
      />
    </form>
  </section>
</template>

<script setup lang="ts">
import langData from "@/data/lang.json";
import { useThemeStore } from "@/stores/useThemeStore";
import { computed, ref, watch } from "vue";

const andYou = ref<HTMLElement | null>(null);
defineExpose({ andYou });

const { locale } = useI18n({ useScope: 'global' });
const lang = computed(() => langData[locale.value.startsWith('fr') ? 'fr' : 'en']);
const themeStore = useThemeStore();
const isFocused = ref(false);
const { $gsap } = useNuxtApp();

watch(
  () => themeStore.visitorName,
  () => {
    themeStore.confirmedName = "";
    themeStore.nameValidated = false;
  },
);

watch(
  () => themeStore.backgroundColor,
  (nouvelleCouleur) => {
    if (import.meta.client) {
      console.log("Nouvelle couleur calculée :", nouvelleCouleur);

      $gsap.to(document.body, {
        backgroundColor: nouvelleCouleur,
        duration: 1.2,
        ease: "power2.out",
        overwrite: true,
      });
    }
  },
  { immediate: true },
);

const emit = defineEmits(["validated"]);

function validateName() {
  if (!themeStore.visitorName) return;

  emit("validated");
}
</script>
