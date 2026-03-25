<template>
  <section class="bio-section section" ref="bio">
    <div class="content-container" :style="dynamicStyles">
      <div class="bio-grid" ref="bioGrid">
        <div class="bio-block">
          <p class="reveal-text">
            <span
              v-for="(line, i) in whatIDo"
              :key="'do-' + i"
              class="reveal-line"
              v-html="line"
            ></span>
          </p>
        </div>
        <div class="bio-block">
          <p class="reveal-text secondary">
            <span
              v-for="(line, i) in howIWork"
              :key="'work-' + i"
              class="reveal-line"
              v-html="line"
            ></span>
          </p>
        </div>
        <div class="bio-block">
          <p class="reveal-text secondary">
            <span
              v-for="(line, i) in currently"
              :key="'curr-' + i"
              class="reveal-line"
              v-html="line"
            ></span>
          </p>
        </div>
        <div class="bio-footer">
          <p class="cta-text">
            <span class="reveal-line transition-phrase highlight">
              {{ about.DoyouWantToSee }}
              <span class="highlight-name">
                {{
                  visitorName && visitorName.trim() !== ""
                    ? visitorName
                    : langData[getLang()].welcome.fallback
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
import { useThemeStore } from "@/stores/useThemeStore";
import { computed, onMounted, ref } from "vue";

import langData from "@/data/lang.json";

const { locale } = useI18n({ useScope: 'global' });
const themeStore = useThemeStore();

const getLang = () => (locale.value.startsWith("fr") ? "fr" : "en");
const about = computed(() => langData[getLang()].About);
const whatIDo = computed(() => about.value.whatIDo);
const howIWork = computed(() => about.value.howIWork);
const currently = computed(() => about.value.Currently);
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
