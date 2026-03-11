<template>
  <section class="bio-section section" ref="bio">
    <div class="content-container">
      <div class="bio-grid">
        <div class="bio-block">
          <p class="reveal-text">
            <span
              v-for="(line, i) in langStore.t.About.whatIDo.split('\n')"
              :key="'do-' + i"
              class="reveal-line"
            >
              {{ line }}
            </span>
          </p>
        </div>

        <div class="bio-block">
          <p class="reveal-text secondary">
            <span
              v-for="(line, i) in langStore.t.About.howIWork.split('\n')"
              :key="'work-' + i"
              class="reveal-line"
            >
              {{ line }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLangStore } from "@/stores/useLangStore";
const langStore = useLangStore();
</script>
