<script lang="ts" setup>
import { IUser } from "~~/types/IUser";
import PieChart from "../components/charts/pie-chart";
import BarChart from "../components/charts/bar-chart";
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
    <div class="w-full h-full overflow-y-auto bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle title="Dashboard" />
      <!-- stats card -->

      <div class="flex flex-wrap ">
        <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
          <div
            class="
              relative
              flex flex-col
              min-w-0
              break-words
              bg-white
              rounded
              mb-3
              xl:mb-0
              shadow-lg
            "
          >
            <div class="flex-auto p-4">
              <div class="flex flex-wrap">
                <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                    Trips
                  </h5>
                  <span class="font-semibold text-xl text-blueGray-700"
                    >334,100</span
                  >
                </div>
                <div class="relative w-auto pl-4 flex-initial">
                  <div
                    class="
                      text-white
                      p-3
                      text-center
                      inline-flex
                      items-center
                      justify-center
                      w-12
                      h-12
                      shadow-lg
                      rounded-full
                      bg-pink-500
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 fill-current"
                      viewBox="0 0 512 512"
                    >
                      <title>Location</title>
                      <circle cx="256" cy="192" r="32" />
                      <path
                        d="M256 32c-88.22 0-160 68.65-160 153 0 40.17 18.31 93.59 54.42 158.78 29 52.34 62.55 99.67 80 123.22a31.75 31.75 0 0051.22 0c17.42-23.55 51-70.88 80-123.22C397.69 278.61 416 225.19 416 185c0-84.35-71.78-153-160-153zm0 224a64 64 0 1164-64 64.07 64.07 0 01-64 64z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p class="text-sm text-blueGray-400 mt-4">
                <span class="text-emerald-500 mr-2"
                  ><i class="fas fa-arrow-up"></i> 2,99%
                </span>
                <span class="whitespace-nowrap"> Since last month </span>
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
          <div
            class="
              relative
              flex flex-col
              min-w-0
              break-words
              bg-white
              rounded
              mb-4
              xl:mb-0
              shadow-lg
            "
          >
            <div class="flex-auto p-4">
              <div class="flex flex-wrap">
                <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                    Users
                  </h5>
                  <span class="font-semibold text-xl text-blueGray-700"
                    >2,999</span
                  >
                </div>
                <div class="relative w-auto pl-4 flex-initial">
                  <div
                    class="
                      text-white
                      p-3
                      text-center
                      inline-flex
                      items-center
                      justify-center
                      w-12
                      h-12
                      shadow-lg
                      rounded-full
                      bg-primary
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 fill-current"
                      viewBox="0 0 512 512"
                    >
                      <title>Utilisateurs</title>
                      <path
                        d="M336 256c-20.56 0-40.44-9.18-56-25.84-15.13-16.25-24.37-37.92-26-61-1.74-24.62 5.77-47.26 21.14-63.76S312 80 336 80c23.83 0 45.38 9.06 60.7 25.52 15.47 16.62 23 39.22 21.26 63.63-1.67 23.11-10.9 44.77-26 61C376.44 246.82 356.57 256 336 256zm66-88zM467.83 432H204.18a27.71 27.71 0 01-22-10.67 30.22 30.22 0 01-5.26-25.79c8.42-33.81 29.28-61.85 60.32-81.08C264.79 297.4 299.86 288 336 288c36.85 0 71 9 98.71 26.05 31.11 19.13 52 47.33 60.38 81.55a30.27 30.27 0 01-5.32 25.78A27.68 27.68 0 01467.83 432zM147 260c-35.19 0-66.13-32.72-69-72.93-1.42-20.6 5-39.65 18-53.62 12.86-13.83 31-21.45 51-21.45s38 7.66 50.93 21.57c13.1 14.08 19.5 33.09 18 53.52-2.87 40.2-33.8 72.91-68.93 72.91zM212.66 291.45c-17.59-8.6-40.42-12.9-65.65-12.9-29.46 0-58.07 7.68-80.57 21.62-25.51 15.83-42.67 38.88-49.6 66.71a27.39 27.39 0 004.79 23.36A25.32 25.32 0 0041.72 400h111a8 8 0 007.87-6.57c.11-.63.25-1.26.41-1.88 8.48-34.06 28.35-62.84 57.71-83.82a8 8 0 00-.63-13.39c-1.57-.92-3.37-1.89-5.42-2.89z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p class="text-sm text-blueGray-400 mt-4">
                <span class="text-red-500 mr-2"
                  ><i class="fas fa-arrow-down"></i> 4,01%</span
                >
                <span class="whitespace-nowrap"> Since last week </span>
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
          <div
            class="
              relative
              flex flex-col
              min-w-0
              break-words
              bg-white
              rounded
              mb-6
              xl:mb-0
              shadow-lg
            "
          >
            <div class="flex-auto p-4">
              <div class="flex flex-wrap">
                <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                    Bookings
                  </h5>
                  <span class="font-semibold text-xl text-blueGray-700"
                    >901</span
                  >
                </div>
                <div class="relative w-auto pl-4 flex-initial">
                  <div
                    class="
                      text-white
                      bg-tertiary
                      p-3
                      text-center
                      inline-flex
                      items-center
                      justify-center
                      w-12
                      h-12
                      shadow-lg
                      rounded-full
                      bg-lightBlue-500
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 fill-current"
                      viewBox="0 0 512 512"
                    >
                      <title>Paper Plane</title>
                      <path
                        d="M473 39.05a24 24 0 00-25.5-5.46L47.47 185h-.08a24 24 0 001 45.16l.41.13 137.3 58.63a16 16 0 0015.54-3.59L422 80a7.07 7.07 0 0110 10L226.66 310.26a16 16 0 00-3.59 15.54l58.65 137.38c.06.2.12.38.19.57 3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0023-15.46L478.39 64.62A24 24 0 00473 39.05z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p class="text-sm text-blueGray-400 mt-4">
                <span class="text-red-500 mr-2"
                  ><i class="fas fa-arrow-down"></i> 1,25%
                </span>
                <span class="whitespace-nowrap"> Since yesterday </span>
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
          <div
            class="
              relative
              flex flex-col
              min-w-0
              break-words
              bg-white
              rounded
              mb-6
              xl:mb-0
              shadow-lg
            "
          >
            <div class="flex-auto p-4">
              <div class="flex flex-wrap">
                <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                    Incomes
                  </h5>
                  <span class="font-semibold text-xl text-blueGray-700"
                    >51 000
                  </span>
                </div>
                <div class="relative w-auto pl-4 flex-initial">
                  <div
                    class="
                      text-white
                      p-3
                      text-center
                      inline-flex
                      items-center
                      justify-center
                      w-12
                      h-12
                      shadow-lg
                      rounded-full
                      bg-emerald-500
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 fill-current"
                      viewBox="0 0 512 512"
                    >
                      <title>Logo Usd</title>
                      <path
                        d="M240 480v-36.42C160.53 439 112.25 398.06 112 336h72c1.77 26.34 23.86 46.45 56 50v-98l-26.77-7c-61-14.18-93.64-49.39-93.64-102.08C119.59 116.81 164.08 76.08 240 70V32h32v38c77.39 6.3 119 47.74 120 106h-72c-.76-24.06-15.83-43.39-48-46v92l30.82 7.28C367.61 243.46 400 277 400 332c0 64.34-43.74 105.88-128 111.32V480zm0-264v-86c-27.59 1.52-47.27 18.47-47.27 42.53 0 22.3 16.39 36.88 47.27 43.47zm32 78v92c38.15-1.54 56.38-18.92 56.38-45.77 0-24.58-18.23-41.13-56.38-46.23z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p class="text-sm text-blueGray-400 mt-4">
                <span class="text-emerald-500 mr-2"
                  ><i class="fas fa-arrow-up"></i> 12%
                </span>
                <span class="whitespace-nowrap"> Since last mounth </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- infos list -->
      <div class="mt-6 flex gap-6 w-full">
        <!-- list -->
        <div class="w-7/12">
          <!-- <Table :headers="dataTableHeaders" :data="data" /> -->
          <div id="app" class="">
          <div class="container mx-auto">
            <div class="py-4">
              <div class="flex items-center px-5 py-2">
                <!-- <span class="w-1/6 text-center">          
          <input type="checkbox" @change="toggleSelect">
        </span> -->
                <span class="w-1/2">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >User Info</span
                  >
                </span>
                <span class="w-1/4">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >Gender</span
                  >
                </span>
                <span class="w-1/4">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >Birth Date</span
                  >
                </span>
                <span class="w-1/4">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >Role</span
                  >
                </span>
                <span class="w-1/4">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >Created At</span
                  >
                </span>
              </div>

              <div
                v-for="(contact, key) in users"
                :key="key"
                class="
                  hover:bg-gray-200
                  cursor-pointer
                  bg-white
                  shadow
                  flex
                  p-5
                  items-center
                  mb-5
                  rounded-lg
                  text-xs
                "
              >
                <!-- <div class="w-1/6 text-center"><input type="checkbox" v-model="contact.selected"></div> -->
                <div class="w-1/2">
                  <div class="flex items-center">
                    <img :src="contact.avatar || 'img/user.jpeg' "  class=" aspect-square w-8 rounded-full" />
                    <div class="ml-4">
                      <span class="capitalize block text-gray-800"
                        >{{ contact.firstName }} {{ contact.lastName }}</span
                      >
                      <span class=" block text-gray-600"
                        >{{ contact.email || contact.phoneNumber }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="w-1/4">
                  <span class="capitalize text-gray-600 ">{{
                    contact.gender
                  }}</span>
                </div>
                <div class="w-1/4">
                  <span class="capitalize text-gray-600 ">{{
                    contact.birthDay
                  }}</span>
                </div>
                <div class="w-1/4">
                  <span class="text-gray-600">{{ contact.role }}</span>
                </div>
                <div class="w-1/4">
                  <span class="text-gray-600">{{
                    contact.createdAt
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <!-- stats -->
        <div class="w-5/12">
          <div class="w-full bg-white shadow-md mb-5">
            <PieChart />
          </div>
          <div class="w-full bg-white shadow-md">
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
