<script lang="ts"  setup>
const props = defineProps(["title"]);
const displayForm = ref(false);
const onDisplayForm = () => (displayForm.value = !displayForm.value);
const onClose = () => (displayForm.value = false);

defineExpose({
  onClose,
});

</script>

<template>
  <div class="absolute flex h-calc z-40 right-0">
    <button
      @click="onDisplayForm"
      class="bg-white text-primary p-2 h-fit text-lg mt-6 shadow-md"
    >
      <svg
        v-if="!displayForm"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 fill-current animate-bounce"
        viewBox="0 0 512 512"
      >
        <title>Add</title>
        <path
          d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M256 176v160M336 256H176"
        />
      </svg>
      <svg
      v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 fill-current"
        viewBox="0 0 512 512"
      >
        <title>Chevron Forward Circle</title>
        <path
          d="M64 256c0 106 86 192 192 192s192-86 192-192S362 64 256 64 64 150 64 256z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M216 352l96-96-96-96"
        />
      </svg>
     
    </button>
    <div
      class="
        w-80
        h-full
        bg-white
        shadow-md
        p-2
        transition-tramsform
        ease-in-out
        duration-500
      "
      v-if="displayForm"
    >
      <div class="flex items-center justify-between">
        <h1 class="text-center text-lg text-primary font-bold">
          {{ title }}
        </h1>
        <button @click="onClose" class="text-red-500 text-sm"></button>
      </div>
      <slot />
    </div>
  </div>
</template>