<template>
  <nav class="vertical-nav" aria-label="Navigation des sections">
    <button
      v-for="(step, index) in steps"
      :key="index"
      class="nav-dot"
      :class="{ active: index <= currentStep }"
      @click="$emit('go-to', index)"
      :aria-label="`Aller à la section ${step}`"
      :aria-current="index === currentStep ? 'true' : undefined"
      :style="{
        backgroundColor:
          index <= currentStep ? accentColor : 'rgba(237, 235, 230, 0.3)',
      }"
    >
      <span
        class="nav-label"
        :style="{ color: index === currentStep ? accentColor : '#edebe6' }"
      >
        {{ step }}
      </span>
    </button>

    <div class="progress-track">
      <div
        class="progress-bar"
        :style="{
          height: progress + '%',
          backgroundColor: accentColor,
          boxShadow: `0 0 15px ${accentColor}`,
        }"
      ></div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/stores/useThemeStore";

const props = defineProps<{
  steps: string[];
  currentStep: number;
  progress: number;
}>();

defineEmits(["go-to"]);

const themeStore = useThemeStore();

const accentColor = computed(() => themeStore.accentColor);
</script>
