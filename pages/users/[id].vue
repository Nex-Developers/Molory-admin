<script lang="ts" setup>
import { IUser } from "~~/types/IUser";

definePageMeta({
  title: "User Details",
  middleware: "auth",
  layout: "private",
});
const route = useRoute();
const id = +route.params.id;
const user = await getUser(id);
const wallet = await getWallet(id);
const isLoadingData = useState<boolean>("showLoader");
</script>

<template>
  <!-- <NuxtLayout> -->
  <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto relative">
    <!-- page title -->
    <Pagetitle :title="'Users/' + user.lastName + ' ' + user.firstName" />
    <!-- stats card -->
    <div class="w-full mt-6">
      <div class="md:flex no-wrap md:-mx-2">
        <!-- Left Side -->
        <div class="w-full md:w-3/12 md:mx-2">
          <!-- Profile Card -->

          <UserInfosPanel :data="user" :id="id" :edit="true" />
          <div class="my-4"></div>
        </div>
        <!-- Right Side -->
        <div class="w-full space-y-4 md:w-9/12 mx-2 h-64">
          <!-- Stats tab -->
          <div class="flex flex-wrap">
            <div class="px-2 lg:w-6/12 xl:w-3/12">
              <div
                class="relative flex flex-col min-w-0 break-words bg-white rounded mb-4 xl:mb-0 shadow-lg h-full w-full"
              >
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div
                      class="relative w-full pr-4 max-w-full flex-grow flex-1"
                    >
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        Trips
                      </h5>
                      <span class="font-semibold text-xl text-blueGray-700">{{
                        user.stats.trips
                      }}</span>
                    </div>
                    <div class="relative w-auto pl-0 flex-initial">
                      <div
                        class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-pink-500"
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
                  <!-- <p class="text-sm text-blueGray-400 mt-4">
                      <span class="text-emerald-500 mr-2"
                        ><i class="fas fa-arrow-up"></i> 2,99%
                      </span>
                      <span class="whitespace-nowrap"> Since last month </span>
                    </p> -->
                </div>
              </div>
            </div>

            <div class="px-2 lg:w-6/12 xl:w-3/12">
              <div
                class="relative flex flex-col min-w-0 break-words bg-white rounded mb-4 xl:mb-0 shadow-lg h-full"
              >
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div class="relative pr-4 max-w-full flex-grow flex-1">
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        Bookings
                      </h5>
                      <span class="font-semibold text-xl text-blueGray-700">{{
                        user.stats.travels
                      }}</span>
                    </div>
                    <div class="relative w-auto pl-0 flex-initial">
                      <div
                        class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-primary"
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
                  <!-- <p class="text-sm text-blueGray-400 mt-4">
                      <span class="text-red-500 mr-2"
                        ><i class="fas fa-arrow-down"></i> 4,01%</span
                      >
                      <span class="whitespace-nowrap"> Since last week </span>
                    </p> -->
                </div>
              </div>
            </div>

            <div class="px-2 lg:w-6/12 xl:w-3/12">
              <div
                class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg h-full w-full"
              >
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div
                      class="relative w-full pr-4 max-w-full flex-grow flex-1"
                    >
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        Spent
                      </h5>
                      <span class="font-semibold text-xl text-blueGray-700"
                        >0</span
                      >
                    </div>
                    <div class="relative w-auto pl-0 flex-initial">
                      <div
                        class="text-white bg-tertiary p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-lightBlue-500"
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
                  <!-- <p class="text-sm text-blueGray-400 mt-4">
                      <span class="text-red-500 mr-2"
                        ><i class="fas fa-arrow-down"></i> 1,25%
                      </span>
                      <span class="whitespace-nowrap"> Since yesterday </span>
                    </p> -->
                </div>
              </div>
            </div>

            <div class="px-2 lg:w-6/12 xl:w-3/12">
              <div
                class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg h-full w-full"
              >
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div
                      class="relative w-full pr-4 max-w-full flex-grow flex-1"
                    >
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        Incomes
                      </h5>
                      <span class="font-semibold text-xl text-blueGray-700"
                        >0
                      </span>
                    </div>
                    <div class="relative w-auto pl-0 flex-initial">
                      <div
                        class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-emerald-500"
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
                  <!-- <p class="text-sm text-blueGray-400 mt-4">
                      <span class="text-emerald-500 mr-2"
                        ><i class="fas fa-arrow-up"></i> 12%
                      </span>
                      <span class="whitespace-nowrap"> Since last mounth </span>
                    </p> -->
                </div>
              </div>
            </div>
          </div>

          <!-- Wallet -->

          <div class="bg-white p-3 shadow-sm rounded-sm">
            <div
              class="flex items-center space-x-2 font-semibold text-secondary leading-8 mb-3"
            >
              <span class="text-tertiary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 fill-current"
                  viewBox="0 0 512 512"
                >
                  <title>Wallet</title>
                  <path
                    d="M95.5 104h320a87.73 87.73 0 0111.18.71 66 66 0 00-77.51-55.56L86 94.08h-.3a66 66 0 00-41.07 26.13A87.57 87.57 0 0195.5 104zM415.5 128h-320a64.07 64.07 0 00-64 64v192a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V192a64.07 64.07 0 00-64-64zM368 320a32 32 0 1132-32 32 32 0 01-32 32z"
                  />
                  <path
                    d="M32 259.5V160c0-21.67 12-58 53.65-65.87C121 87.5 156 87.5 156 87.5s23 16 4 16-18.5 24.5 0 24.5 0 23.5 0 23.5L85.5 236z"
                  />
                </svg>
              </span>
              <span class="tracking-wide">Portefeuille</span>
            </div>
            <div class="flex gap-2">

            <div
              class="items-center border border-primary rounded-md p-2 my-2 w-1/2"
            >
              <h2 class="text-md font-bold text-center underline">Solde</h2>
              <div class="text-center pt-8">
                <span class="text-primary capitalize text-center text-2xl font-bold">
                    5000 FCFA</span
                  >
              </div>
                 
              
            </div>
           
            <div
              class=" space-y-4 rounded-md p-2 my-2 w-1/2 flex-none border border-primary"
            >
            <div class="w-full flex justify-center">
              <input type="number" step="100" class=" max-w-lg p-2 border text-center text-lg" placeholder="Montant">
            </div>
            <div class="w-full gap-2 flex justify-center">
              <button class="w-32 bg-primary py-2 text-lg text-white rounded"> Recharger </button>
              <button class="w-32 border border-primary py-2 text-lg text-primary rounded"> Retirer </button>
            </div>
            </div>
          </div>

          </div>

          <!-- Documents start -->
          <div class="bg-white p-3 shadow-sm rounded-sm">
            <div class="">
              <div>
                <div
                  class="flex items-center space-x-2 font-semibold text-secondary leading-8 mb-3"
                >
                  <span class="text-tertiary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 fill-current"
                      viewBox="0 0 512 512"
                    >
                      <title>Document Attach</title>
                      <path
                        d="M208 64h66.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62V432a48 48 0 01-48 48H192a48 48 0 01-48-48V304"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                      />
                      <path
                        d="M288 72v120a32 32 0 0032 32h120"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                      />
                      <path
                        d="M160 80v152a23.69 23.69 0 01-24 24c-12 0-24-9.1-24-24V88c0-30.59 16.57-56 48-56s48 24.8 48 55.38v138.75c0 43-27.82 77.87-72 77.87s-72-34.86-72-77.87V144"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-miterlimit="10"
                        stroke-width="32"
                      />
                    </svg>
                  </span>
                  <span class="tracking-wide">Documents</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="document in user.documents"
                    :key="document.name"
                    class="items-center border border-tertiary text-xs rounded-md p-2 my-2"
                  >
                    <div class="relative">
                      <h2 class="text-center text-lg text-secondary">
                        {{ document.name }}
                      </h2>
                      <div class="text-xs absolute top-0 right-0">
                        <span
                          v-if="document.status == 2"
                          class="bg-secondary text-white py-1 px-2 rounded-l-full rounded-r-full"
                          >Waiting...</span
                        >
                        <span
                          v-else-if="document.status == 1"
                          class="bg-success text-white py-1 px-2 rounded-l-full rounded-r-full"
                          >Confirmed</span
                        >
                        <span
                          v-else-if="document.status === 0"
                          class="bg-danger text-white py-1 px-2 rounded-l-full rounded-r-full"
                          >Not confirmed</span
                        >
                      </div>
                    </div>

                    <div>
                      <p v-if="document.status == 1">
                        Reference:
                        <span class="underline">{{ document.reference }}</span>
                      </p>
                      <p
                        v-else-if="document.status == 0"
                        class="text-danger opacity-80"
                      >
                        Rejection message: "{{ document.rejectionMessage }}""
                      </p>

                      <div
                        class="flex flex-col gap-2"
                        v-if="document.name === 'ID Card'"
                      >
                        <DocumentItem
                          title="Devant"
                          :path="document.urlFront"
                        />
                        <DocumentItem
                          title="Derriere"
                          :path="document.urlBack"
                        />
                      </div>

                      <div
                        class="flex flex-col gap-2"
                        v-if="document.name === 'Driver License'"
                      >
                        <DocumentItem
                          title="Devant"
                          :path="document.urlFront"
                        />
                        <DocumentItem
                          title="Derriere"
                          :path="document.urlBack"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- End of Experience and education grid -->
          </div>
          <!-- documents end -->

          <!-- Vehicles start -->
          <div class="bg-white p-3 shadow-sm rounded-sm">
            <div class="">
              <div>
                <div
                  class="flex items-center space-x-2 font-semibold text-secondary leading-8 mb-3"
                >
                  <span class="text-tertiary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 fill-current"
                      viewBox="0 0 512 512"
                    >
                      <title>Car Sport</title>
                      <path
                        d="M469.71 234.6c-7.33-9.73-34.56-16.43-46.08-33.94s-20.95-55.43-50.27-70S288 112 256 112s-88 4-117.36 18.63-38.75 52.52-50.27 70-38.75 24.24-46.08 33.97S29.8 305.84 32.94 336s9 48 9 48h86c14.08 0 18.66-5.29 47.46-8 31.6-3 62.6-4 80.6-4s50 1 81.58 4c28.8 2.73 33.53 8 47.46 8h85s5.86-17.84 9-48-2.04-91.67-9.33-101.4zM400 384h56v16h-56zM56 384h56v16H56z"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                      />
                      <path
                        d="M364.47 309.16c-5.91-6.83-25.17-12.53-50.67-16.35S279 288 256.2 288s-33.17 1.64-57.61 4.81-42.79 8.81-50.66 16.35C136.12 320.6 153.42 333.44 167 335c13.16 1.5 39.47.95 89.31.95s76.15.55 89.31-.95c13.56-1.65 29.62-13.6 18.85-25.84zM431.57 243.05a3.23 3.23 0 00-3.1-3c-11.81-.42-23.8.42-45.07 6.69a93.88 93.88 0 00-30.08 15.06c-2.28 1.78-1.47 6.59 1.39 7.1a455.32 455.32 0 0052.82 3.1c10.59 0 21.52-3 23.55-12.44a52.41 52.41 0 00.49-16.51zM80.43 243.05a3.23 3.23 0 013.1-3c11.81-.42 23.8.42 45.07 6.69a93.88 93.88 0 0130.08 15.06c2.28 1.78 1.47 6.59-1.39 7.1a455.32 455.32 0 01-52.82 3.1c-10.59 0-21.52-3-23.55-12.44a52.41 52.41 0 01-.49-16.51z"
                      />
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                        d="M432 192h16M64 192h16M78 211s46.35-12 178-12 178 12 178 12"
                      />
                    </svg>
                  </span>
                  <span class="tracking-wide">Vehicles</span>
                </div>
                <div class="flex gap-2">
                  <div
                    v-for="vehicle in user.vehicles"
                    :key="vehicle.id"
                    class="grid grid-cols-auto gap-2 items-center border border-tertiary rounded-md p-2 my-2 w-1/2"
                  >
                    <h2 class="text-md font-bold text-center underline">
                      {{ vehicle.numberPlate }}
                    </h2>
                    <ul class="text-sm text-secondary">
                      <li>
                        <!-- Type: -->
                        <span class="text-primary capitalize"
                          >{{ vehicle.type }} {{ vehicle.model }}
                          {{ vehicle.color }}</span
                        >
                      </li>
                      <!-- <li>
                          Color:
                          <span class="text-primary capitalize">{{
                            vehicle.color
                          }}</span>
                        </li> -->
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- End of Experience and education grid -->
          </div>
          <!-- vehicles end -->

          <!-- Preferences start -->
          <div class="bg-white p-3 shadow-sm rounded-sm">
            <div
              class="flex items-center space-x-2 font-semibold text-secondary leading-8"
            >
              <span class="text-tertiary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-current"
                  viewBox="0 0 512 512"
                >
                  <title>Happy</title>
                  <circle cx="184" cy="232" r="24" />
                  <path
                    d="M256.05 384c-45.42 0-83.62-29.53-95.71-69.83a8 8 0 017.82-10.17h175.69a8 8 0 017.82 10.17c-11.99 40.3-50.2 69.83-95.62 69.83z"
                  />
                  <circle cx="328" cy="232" r="24" />
                  <circle
                    cx="256"
                    cy="256"
                    r="208"
                    fill="none"
                    stroke="currentColor"
                    stroke-miterlimit="10"
                    stroke-width="32"
                  />
                </svg>
              </span>
              <span class="tracking-wide">Preferences</span>
            </div>
            <div
              v-for="preference in user.preferences"
              :key="preference.id"
              class="grid items-center border border-tertiary text-xs rounded-md p-2 my-2"
            >
              <ul class="text-sm text-secondary">
                <li>
                  {{ preference.question.value }} <br />
                  <span class="text-primary capitalize"
                    >{{ preference.answer.value }}
                  </span>
                </li>
              </ul>
              <p></p>
            </div>
          </div>
          <!-- Preferences end  -->
        </div>
      </div>
    </div>
    <AlertsLoader v-if="isLoadingData" />
  </div>
  <!-- </NuxtLayout> -->
</template>
