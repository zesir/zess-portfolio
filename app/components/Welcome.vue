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
import { nextTick, ref, watch } from "vue";
const { $gsap } = useNuxtApp();

const langStore = useLangStore();
const themeStore = useThemeStore();
const isFocused = ref(false);
const visitorName = computed(() => themeStore.visitorName);
const nameValidated = useState<boolean>("nameValidated");

const welcome = ref<HTMLElement | null>(null);
const nameRef = ref<HTMLElement | null>(null);
const introduceRef = ref<HTMLElement | null>(null);

defineExpose({ welcome, nameRef, introduceRef });

watch(nameValidated, async (isValid) => {
  if (isValid && nameRef.value) {
    await nextTick();
    $gsap.fromTo(
      nameRef.value,
      { scale: 0, opacity: 0, rotate: -10 },
      {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      },
    );
  }
});

onMounted(() => {
  if (!introduceRef.value) return;

  $gsap.to(introduceRef.value, {
    scrollTrigger: {
      trigger: welcome.value, // Se déclenche quand la section Welcome arrive
      start: "top 20%", // Dès que le haut de la section est proche du haut
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power2.out",
    delay: 0.5,
  });
});
</script>
