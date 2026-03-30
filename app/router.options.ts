export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    // Si un step GSAP est ciblé, ou si c'est juste un nettoyage d'URL (replace sur même path),
    // le scroll est géré manuellement dans onMounted
    if (to.query.step || (from && to.path === from.path)) {
      return false;
    }
    return { top: 0 };
  },
};
