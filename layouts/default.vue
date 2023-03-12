<script setup lang="ts">
useHead({
  title: "Molory Admin",
  // or, instead:
  // titleTemplate: (title) => `My App - ${title}`,
  // viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  // charset: "utf-8",
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {
    class: "test",
  },
});
</script>

<template>
  <div class="h-screen bg-primary">
    <slot />
  </div>
</template>