import en from "./app/locales/en.json";
import fr from "./app/locales/fr.json";

export default defineI18nConfig(() => ({
  legacy: false,
  allowHtml: true,
  messages: { en, fr },
}));
