<script setup lang="ts">

</script>

<template>
  <div class="h-screen overflow-hidden">
    <Navbar />
    <div class="w-full h-calc flex">
      <Sidebar  />
      <slot />
    </div>
  </div>
</template>