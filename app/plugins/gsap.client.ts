import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

  return {
    provide: {
      gsap,
      ScrollTrigger,
      SplitText,
      ScrollToPlugin,
    },
  };
});
