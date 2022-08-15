<script setup lang="ts">
</script>

<template>
  <div class="h-screen bg-indigo-500 overflow-hidden">
    <Navbar />
    <div class="w-full h-[calc(100%_-_5rem)] flex">
      <Sidebar  />
      <slot />
    </div>
  </div>
</template>