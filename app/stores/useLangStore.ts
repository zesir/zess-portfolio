import langData from "@/data/lang.json";
import { defineStore } from "pinia";

export const useLangStore = defineStore("lang", () => {
  const locale = useState<string>("locale", () => "en");

  const t = computed(() => {
    return langData[locale.value as keyof typeof langData];
  });

  const toggleLang = () => {
    locale.value = locale.value === "en" ? "fr" : "en";
  };

  return { locale, t, toggleLang };
});
