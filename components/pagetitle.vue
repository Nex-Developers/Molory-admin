<script setup>
const props = defineProps({
    title: String
});
</script>

<template>
  <div class="sticky">
    <h3 class="text-secondary text-lg font-bold">{{ title }}</h3>
  </div>
</template>
