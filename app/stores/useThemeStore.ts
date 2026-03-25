// stores/useThemeStore.ts
import { defineStore } from "pinia";
import { computed } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const visitorName = useState<string>("visitorName", () => "");
  const confirmedName = useState<string>("confirmedName", () => "");
  const nameValidated = useState<boolean>("nameValidated", () => false);

  const getHue = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return 15 + Math.abs(hash % 20);
  };

  // Couleur pour les accents
  const accentColor = computed(() => {
    const name = visitorName.value?.trim().toLowerCase();
    if (!name) return "#e85d04";
    return `hsl(${getHue(name)}, 90%, 55%)`;
  });

  //  Couleur sombre pour le background
  const backgroundColor = computed(() => {
    const name = visitorName.value?.trim().toLowerCase();
    if (!name) return "#111111";
    const hue = getHue(name);

    return `hsl(${hue}, 25%, 12%)`;
  });
  return {
    visitorName,
    confirmedName,
    nameValidated,
    accentColor,
    backgroundColor,
  };
});
