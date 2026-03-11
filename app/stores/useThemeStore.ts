// stores/useThemeStore.ts
import { defineStore } from "pinia";
import { computed } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const visitorName = useState<string>("visitorName", () => "");

  // Fonction utilitaire pour générer le hash
  const getHue = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      // Algorithme de hachage simple
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return 15 + Math.abs(hash % 20);
  };

  // 1. Couleur vive pour les accents
  const accentColor = computed(() => {
    const name = visitorName.value?.trim().toLowerCase();
    if (!name) return "#e85d04"; // Ton orange d'origine
    return `hsl(${getHue(name)}, 90%, 55%)`;
  });

  // 2. Couleur sombre pour le background (Version "Chocolat/Terre" élégante)
  const backgroundColor = computed(() => {
    const name = visitorName.value?.trim().toLowerCase();
    if (!name) return "#111111"; // Noir neutre par défaut
    const hue = getHue(name); // Utilise directement ta fonction getHue

    return `hsl(${hue}, 25%, 12%)`;
  });
  return {
    visitorName,
    accentColor,
    backgroundColor,
  };
});
