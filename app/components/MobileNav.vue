<template>
  <div class="mobile-nav" v-if="isMobile">
    <button
      class="hamburger"
      :class="{ open: isOpen }"
      @click="toggle"
      @keydown.escape="isOpen = false"
      :aria-expanded="isOpen"
      aria-controls="nav-overlay"
      aria-label="Ouvrir le menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <Transition name="overlay">
      <div
        v-if="isOpen"
        id="nav-overlay"
        class="nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        @keydown.escape="isOpen = false"
      >
        <nav class="nav-overlay__links">
          <button
            v-for="(step, index) in steps"
            :key="index"
            class="nav-overlay__item"
            tabindex="0"
            @click="handleNav(index)"
            @keydown.enter="handleNav(index)"
          >
            <span class="nav-overlay__number" aria-hidden="true"
              >0{{ index + 1 }}</span
            >
            <span class="nav-overlay__label">{{ step }}</span>
          </button>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  steps: string[];
}>();

const emit = defineEmits<{
  (e: "go-to", index: number): void;
}>();

const isOpen = ref(false);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const handleNav = (index: number) => {
  emit("go-to", index);
  isOpen.value = false;
};

watch(isOpen, async (val) => {
  if (val) {
    await nextTick();
    const firstBtn = document.querySelector(
      ".nav-overlay__item",
    ) as HTMLElement;
    firstBtn?.focus();
  }
});

const trapFocus = (e: KeyboardEvent) => {
  if (!isOpen.value || e.key !== "Tab") return;

  const focusables = Array.from(
    document.querySelectorAll(".nav-overlay button, .hamburger"),
  ) as HTMLElement[];

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last?.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first?.focus();
  }
};

// ✅ Un seul onMounted et onUnmounted
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  window.addEventListener("keydown", trapFocus);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  window.removeEventListener("keydown", trapFocus);
});
</script>
