<template>
  <section class="and-you section" ref="andYou">
    <h2 class="section-title">{{ langStore.t.identity.title }}</h2>
    <form class="form">
      <input
        type="text"
        :placeholder="langStore.t.identity.placeholder"
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
import { useLangStore } from "@/stores/useLangStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { ref, watch } from "vue";

const andYou = ref<HTMLElement | null>(null);
defineExpose({ andYou });

const langStore = useLangStore();
const themeStore = useThemeStore();
const isFocused = ref(false);
const { $gsap } = useNuxtApp();

watch(
  () => themeStore.visitorName,
  (valeurDuNom) => {
    console.log("Le nom a changé dans le store :", valeurDuNom);
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
