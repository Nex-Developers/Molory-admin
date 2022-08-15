<template>
  <div class="w-full p-2">
    <div>{{ title }}</div>
    <table class="w-full border-separate border-spacing-y-2">
      <thead class="w-full">
        <tr class="h-16 text-primary text-left capitalize">
          <th>#</th>
          <th v-for="(header, index) in headers" :key="index">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-gray-200 h-16 mx-5" v-for="(item, i) in data" :key="i" @click="details(item.id)">
          <td class="px-2">{{ i + 1 }}</td>
          <td v-for="(header, j) in headers" :key="j">
            <div class="p-2" v-if="header.type == 'image'">
              <img class="w-16 aspect-square rounded-full object-cover" :src="item[header.field] || 'img/user.jpeg'" alt="" />
            </div>
            <span v-else>{{ item[header.field] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  headers: Array,
  data: {
    type: Array,
    required: true,
  },
  details: Function
});

</script>