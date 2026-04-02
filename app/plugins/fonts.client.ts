export default defineNuxtPlugin(() => {
  const urls = [
    "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;600;700&family=Inter:wght@300;400;800&display=swap",
    "https://use.typekit.net/cme4duv.css",
  ];

  urls.forEach((href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  });
});
