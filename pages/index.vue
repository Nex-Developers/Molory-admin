<script lang="ts" setup>
import { IUser } from "~~/types/IUser";
// import * as chartConfigs from "@/components/Charts/config.js";
// import config from "@/config.js";
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
// const purpleLineChart = {
//   extraOptions: chartConfigs.purpleChartOptions,
//   chartData: {
//     labels: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
//     datasets: [
//       {
//         label: "Data",
//         fill: true,
//         borderColor: config.colors.primary,
//         borderWidth: 2,
//         borderDash: [],
//         borderDashOffset: 0.0,
//         pointBackgroundColor: config.colors.primary,
//         pointBorderColor: "rgba(255,255,255,0)",
//         pointHoverBackgroundColor: config.colors.primary,
//         pointBorderWidth: 20,
//         pointHoverRadius: 4,
//         pointHoverBorderWidth: 15,
//         pointRadius: 4,
//         data: [80, 100, 70, 80, 120, 80],
//       },
//     ],
//   },
//   gradientColors: config.colors.primaryGradient,
//   gradientStops: [1, 0.2, 0],
// };
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
          <!-- <ChartsLineChart
            style="height: 100%"
            id ="chartId"
            chartId='my-chart'
            :chart-data="purpleLineChart.chartData"
            :gradient-colors="purpleLineChart.gradientColors"
            :gradient-stops="purpleLineChart.gradientStops"
            :extra-options="purpleLineChart.extraOptions"
          >
          </ChartsLineChart> -->
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
