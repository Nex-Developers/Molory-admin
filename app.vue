<template>
  <div>
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
import { useUser } from "~/composables/useAuth";
useHead({
  title: "Molory Admin",
  // or, instead:
  // titleTemplate: (title) => `My App - ${title}`,
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {
    class: "test",
  },
});
const nuxtApp = useNuxtApp();

nuxtApp.hook("page:finish", () => {
  window.scrollTo(0, 0);
});
await useUser();
</script>