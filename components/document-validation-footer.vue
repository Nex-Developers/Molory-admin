<script lang="ts" setup>
    const props = defineProps({
        title: String,
        response: String
    })
</script>
<template>
    <div class="flex justify-between items-center">
        <div class="p-2 w-3/4">
            <input class="w-full p-2 border-b border-gray-200" type="text" placeholder="Enter Card Number to validate either enter rejection message" v-model="response">
        </div>
        <div class="py-2 w-1/4">
            <button class="bg-green-500 py-1 px-2 mr-4 rounded-md text-white" @click="$emit('validate', response, title)">Validate</button>
            <button class="bg-red-500 py-1 px-2 text-white rounded-md mr-4" @click="$emit('reject', response, title)">Reject</button>
        </div>
    </div>
</template>