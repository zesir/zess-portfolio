<template>
  <Preloader />
  <CustomCursor />
  <Transition name="toast">
    <div
      v-if="toast.toastVisible.value"
      class="project-toast"
      role="status"
      aria-live="polite"
      :style="{ '--accent-color': themeStore.accentColor }"
    >
      <span>{{ toast.toastPrefix.value }} <em>{{ toast.toastName.value }}</em>{{ toast.toastSuffix.value }}</span>
    </div>
  </Transition>
  <NuxtLayout>
    <LangSwitcher />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/useThemeStore';
const themeStore = useThemeStore();
const toast = useProjectToast();
</script>
