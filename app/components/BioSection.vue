<template>
  <section class="bio-section section" ref="bio">
    <div class="content-container" :style="dynamicStyles">
      <div class="bio-grid" ref="bioGrid">
        <div class="bio-block">
          <p class="reveal-text">
            <span
              v-for="(line, i) in langStore.t.About.whatIDo"
              :key="'do-' + i"
              class="reveal-line"
              v-html="line"
            ></span>
          </p>
        </div>
        <div class="bio-block">
          <p class="reveal-text secondary">
            <span
              v-for="(line, i) in langStore.t.About.howIWork"
              :key="'work-' + i"
              class="reveal-line"
              v-html="line"
            ></span>
          </p>
        </div>
        <div class="bio-block">
          <p class="reveal-text secondary">
            <span
              v-for="(line, i) in langStore.t.About.Currently"
              :key="'curr-' + i"
              class="reveal-line"
              v-html="line"
            ></span>
          </p>
        </div>
        <div class="bio-footer">
          <p class="cta-text">
            <span class="reveal-line transition-phrase highlight">
              {{ langStore.t.About.DoyouWantToSee }}
              <span class="highlight-name">
                {{
                  visitorName && visitorName.trim() !== ""
                    ? visitorName
                    : langStore.t.welcome.fallback
                }}
              </span>
              !!
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLangStore } from "@/stores/useLangStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { computed, onMounted, ref } from "vue";

const langStore = useLangStore();
const themeStore = useThemeStore();

const visitorName = computed(() => themeStore.visitorName);

const bio = ref<HTMLElement | null>(null);
const bioGrid = ref<HTMLElement | null>(null);
const allLines = ref<HTMLElement[]>([]);

const dynamicStyles = computed(() => ({
  "--accent-color": themeStore.accentColor,
}));

onMounted(() => {
  if (bio.value) {
    allLines.value = Array.from(bio.value.querySelectorAll(".reveal-line"));
  }
});

defineExpose({ bio, bioGrid, allLines });
</script>
