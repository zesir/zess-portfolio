<template>
  <section
    class="contact-section"
    ref="contactRef"
    aria-labelledby="contact-section-heading"
    :style="{ '--accent-color': themeStore.accentColor }"
  >
    <div class="contact-inner">
      <div class="contact-header">
        <h2 id="contact-section-heading" class="contact-title">
          {{ lang.contact.title
          }}<template v-if="themeStore.confirmedName"
            >, <span>{{ themeStore.confirmedName }}</span></template
          >
        </h2>
        <p class="contact-subtitle">{{ lang.contact.subtitle }}</p>
      </div>

      <form class="contact-form" @submit.prevent="sendEmail">
        <div class="form-row">
          <div class="form-group">
            <label for="contact-name" class="visually-hidden">{{ lang.contact.name }}</label>
            <input
              id="contact-name"
              type="text"
              v-model="form.name"
              :placeholder="lang.contact.name"
              required
            />
          </div>
          <div class="form-group">
            <label for="contact-email" class="visually-hidden">{{ lang.contact.email }}</label>
            <input
              id="contact-email"
              type="email"
              v-model="form.email"
              :placeholder="lang.contact.email"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="contact-message" class="visually-hidden">{{ lang.contact.message }}</label>
          <textarea
            id="contact-message"
            v-model="form.message"
            :placeholder="lang.contact.message"
            rows="6"
            required
          />
        </div>

        <div class="form-footer">
          <span class="form-status" :class="status">{{ statusMessage }}</span>
          <button type="submit" class="submit-btn" :disabled="sending">
            {{ sending ? lang.contact.sending : lang.contact.send }}
            <ClientOnly
              ><Icon name="lucide:arrow-right" size="18"
            /></ClientOnly>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import langData from "@/data/lang.json";
import { useThemeStore } from "@/stores/useThemeStore";
import emailjs from "@emailjs/browser";
import { computed, reactive, ref } from "vue";

// ⚠️ Remplace ces valeurs par tes identifiants EmailJS
const EMAILJS_SERVICE_ID = "service_s5u6kti";
const EMAILJS_TEMPLATE_ID = "template_ohk9r0d";
const EMAILJS_PUBLIC_KEY = "E6T7T6VksDLznrmLR";

const { locale } = useI18n({ useScope: "global" });
const lang = computed(
  () => langData[locale.value.startsWith("fr") ? "fr" : "en"],
);
const themeStore = useThemeStore();

const contactRef = ref<HTMLElement | null>(null);
defineExpose({ contactRef });

const form = reactive({
  name: themeStore.confirmedName || "",
  email: "",
  message: "",
});

watch(
  () => themeStore.confirmedName,
  (name) => {
    if (name && !form.name) form.name = name;
  },
);
const sending = ref(false);
const status = ref<"" | "success" | "error">("");
const statusMessage = ref("");

const sendEmail = async () => {
  sending.value = true;
  status.value = "";
  statusMessage.value = "";

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name: form.name,
        email: form.email,
        message: form.message,
      },
      EMAILJS_PUBLIC_KEY,
    );

    status.value = "success";
    statusMessage.value = lang.value.contact.success;
    form.name = "";
    form.email = "";
    form.message = "";
  } catch {
    status.value = "error";
    statusMessage.value = lang.value.contact.error;
  } finally {
    sending.value = false;
  }
};
</script>
