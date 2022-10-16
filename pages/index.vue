<script lang="ts" setup>
import { IUser } from "~~/types/IUser";

definePageMeta({
  middleware: "auth",
  layout: "private",
});

let data = ref([]);
const dataTableHeaders = [
  { label: "Avatar", field: "avatar", type: "image" },
  { label: "First Name", field: "firstName" },
  { label: "Last Name", field: "lastName" },
  { label: "Phone Number", field: "phoneNumber" },
  { label: "Role", field: "role" },
];
const users = useState<IUser[]>("users");
getUsers();
const chartData = computed(() => {
  return {
    labels: [1, 2, 3, 4, 5],
    datasets: [
      {
        label: "",
        data: [2, 1, 16, 3, 2],
        backgroundColor: "rgba(20, 255, 0, 0.3)",
        borderColor: "rgba(100, 255, 0, 1)",
        borderWidth: 2,
      },
    ],
  };
});
</script>
<template>
  <NuxtLayout>
    <div class="w-full h-[100%] bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle title="Dashboard" />
      <!-- stats card -->

      <div class="mt-6 w-full flex gap-6">
        <div class="w-1/4 h-64 shadow-sm bg-primary"></div>
        <div class="w-1/4 h-64 shadow-sm bg-white"></div>
        <div class="w-1/4 h-64 shadow-sm bg-white"></div>
        <div class="w-1/4 h-64 shadow-sm bg-white"></div>
      </div>

      <!-- infos list -->
      <div class="mt-6 flex gap-6 w-full">
        <!-- list -->
        <div class="w-7/12 h-96 bg-white shadow-md">
          <!-- <Table :headers="dataTableHeaders" :data="data" /> -->
        </div>
        <!-- stats -->
        <div class="w-5/12 h-96 bg-white shadow-md">
          <BarChart :data="chartData" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
