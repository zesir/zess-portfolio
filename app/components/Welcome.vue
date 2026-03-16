<template>
  <section class="welcome section" ref="welcome">
    <div class="welcome-content">
      <h2 class="section-title">
        <span class="prefix">{{ langStore.t.welcome.prefix }}</span>
        <strong ref="nameRef" class="visitor-name">
          {{
            visitorName && visitorName.trim() !== ""
              ? visitorName
              : langStore.t.welcome.fallback
          }}
        </strong>
      </h2>

      <p v-if="!visitorName || visitorName.trim() === ''" class="sub-text">
        {{ langStore.t.welcome.callJohn }}
      </p>
    </div>

    <div class="scroll-invitation" ref="introduceRef">
      <p class="reveal-text">{{ langStore.t.welcome.LetIntroduce }}</p>
      <div class="scroll-arrow">↓</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLangStore } from "@/stores/useLangStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { computed, nextTick, onMounted, ref, watch } from "vue";
const { $gsap } = useNuxtApp();

const langStore = useLangStore();
const themeStore = useThemeStore();
const visitorName = computed(() => themeStore.visitorName);
const nameValidated = useState<boolean>("nameValidated");

const welcome = ref<HTMLElement | null>(null);
const nameRef = ref<HTMLElement | null>(null);
const introduceRef = ref<HTMLElement | null>(null);

defineExpose({ welcome, nameRef, introduceRef });

// Fonction d'animation réutilisable
const animateName = () => {
  if (!nameRef.value) return;

  $gsap.killTweensOf(nameRef.value);

  $gsap.fromTo(
    nameRef.value,
    {
      autoAlpha: 0, // Force visibility: hidden + opacity: 0
      scale: 0,
      rotate: -10,
    },
    {
      autoAlpha: 1, // Force visibility: visible + opacity: 1
      scale: 1,
      rotate: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
      delay: 0.1, // Petit délai pour laisser le slide se stabiliser
    },
  );
};

// On observe le store
watch(
  () => themeStore.nameValidated,
  (isValid) => {
    if (isValid) {
      nextTick(() => animateName());
    }
  },
);

// On surveille le changement de validation
watch(nameValidated, (isValid) => {
  if (isValid) {
    nextTick(() => animateName());
  }
});

onMounted(() => {
  // 1. On ne touche pas à nameRef ici si !nameValidated.
  // On laisse le HTML/CSS afficher "John" tranquillement.

  if (nameValidated.value || themeStore.nameValidated) {
    // Optionnel : on n'anime que si on veut vraiment l'effet au refresh
    // sinon on laisse statique pour éviter tout saut.
    $gsap.set(nameRef.value, { autoAlpha: 1, scale: 1 });
  }

  // 2. Animation de l'invitation au scroll (indépendante)
  if (introduceRef.value && welcome.value) {
    $gsap.fromTo(
      introduceRef.value,
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: welcome.value,
          start: "top 80%", // Ajusté pour être sûr que ça déclenche
        },
        opacity: 1,
        y: 0,
        duration: 1,
      },
    );
  }
});

// 3. Le déclencheur UNIQUE
watch(
  () => themeStore.nameValidated,
  (newVal, oldVal) => {
    // On n'anime QUE si on vient de cliquer sur "Valider" (le passage de false à true)
    if (newVal === true && oldVal === false) {
      nextTick(() => {
        animateName();
      });
    }
  },
);
</script>
