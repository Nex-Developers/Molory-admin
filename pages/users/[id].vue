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
const isLoadingData = useState<boolean>('showLoader');

</script>

<template>
  <NuxtLayout>
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
            <div class="grid grid-cols-4 gap-4">
              <div
                class="
                  bg-white
                  p-3
                  shadow-sm
                  rounded-sm
                  grid grid-cols-1
                  2xl:grid-cols-2 2xl:aspect-auto
                  place-items-center
                "
              >
                <div class="text-tertiary flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-24 h-24 fill-current"
                    viewBox="0 0 512 512"
                  >
                    <title>Star</title>
                    <path
                      d="M496 203.3H312.36L256 32l-56.36 171.3H16l150.21 105.4-58.5 171.3L256 373.84 404.29 480l-58.61-171.3z"
                    />
                  </svg>
                </div>
                <div class="text-center">
                  <span class="text-secondary text-4xl opacity-50">
                    {{ user.rating || "0.0" }}</span
                  >
                </div>
              </div>

              <div
                class="
                  bg-white
                  p-3
                  shadow-sm
                  rounded-sm
                  grid
                  2xl:grid-cols-2
                  place-items-center
                "
              >
                <div class="text-secondary flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-24 h-24 fill-current"
                    viewBox="0 0 512 512"
                  >
                    <title>Balance</title>
                    <path
                      d="M47.5 104H432V51.52a16 16 0 00-19.14-15.69l-368 60.48a16 16 0 00-12 10.47A39.69 39.69 0 0147.5 104zM463.5 128h-416a16 16 0 00-16 16v288a16 16 0 0016 16h416a16 16 0 0016-16V144a16 16 0 00-16-16zM368 320a32 32 0 1132-32 32 32 0 01-32 32z"
                    />
                    <path
                      d="M31.33 259.5V116c0-12.33 5.72-18.48 15.42-20 35.2-5.53 108.58-8.5 108.58-8.5s-8.33 16-27.33 16V128c18.5 0 31.33 23.5 31.33 23.5L84.83 236z"
                    />
                  </svg>
                </div>
                <div class="text-center">
                  <span class="text-secondary text-4xl opacity-50">{{
                    user.wallet?.balance || "0"
                  }}</span>
                  <span class="text-secondary opacity-50"> F CFA</span>
                </div>
              </div>

              <div
                class="
                  bg-white
                  p-3
                  shadow-sm
                  rounded-sm
                  grid
                  2xl:grid-cols-2
                  place-items-center
                "
              >
                <div class="text-primary flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-24 h-24 fill-current"
                    viewBox="0 0 512 512"
                  >
                    <title>Trips</title>
                    <path d="M480 32L32 240h240v240L480 32z" />
                  </svg>
                </div>
                <div class="text-center">
                  <span class="text-secondary text-4xl opacity-50">{{
                    user.stats?.trips || "0"
                  }}</span>
                  <span class="text-secondary opacity-50">trip(s)</span>
                </div>
                <!-- icon dollar -->
              </div>

              <div
                class="
                  bg-white
                  p-3
                  shadow-sm
                  rounded-sm
                  grid
                  2xl:grid-cols-2
                  place-items-center
                "
              >
                <div class="text-success flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-24 h-24 fill-current"
                    viewBox="0 0 512 512"
                  >
                    <title>Income</title>
                    <path
                      d="M58 362.09l-6.51-14.59A224 224 0 01256 32h16v234.37z"
                    />
                    <path
                      d="M304 66.46v220.65L94.62 380.78A208.31 208.31 0 00272 480c114.69 0 208-93.31 208-208 0-103.81-76.45-190.1-176-205.54z"
                    />
                  </svg>
                </div>
                <div class="text-center">
                  <span class="text-secondary text-4xl opacity-50">{{
                    user.income || "0"
                  }}</span
                  ><span class="text-secondary opacity-50"> F CFA</span>
                </div>
                <!-- icon users -->
              </div>
            </div>
            <!-- Documents start -->
            <div class="bg-white p-3 shadow-sm rounded-sm">
              <div class="">
                <div>
                  <div
                    class="
                      flex
                      items-center
                      space-x-2
                      font-semibold
                      text-secondary
                      leading-8
                      mb-3
                    "
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
                      :key="document.id"
                      class="
                        items-center
                        border border-tertiary
                        text-xs
                        rounded-md
                        p-2
                        my-2
                        h-16
                      "
                    >
                      <div class="relative">
                        <h2 class="text-center text-lg text-secondary">
                          {{ document.name }}
                        </h2>
                        <div class="text-xs absolute top-0 right-0">
                          <span
                            v-if="document.status == 2"
                            class="
                              bg-secondary
                              text-white
                              py-1
                              px-2
                              rounded-l-full rounded-r-full
                            "
                            >Waiting...</span
                          >
                          <span
                            v-else-if="document.status == 1"
                            class="
                              bg-success
                              text-white
                              py-1
                              px-2
                              rounded-l-full rounded-r-full
                            "
                            >Confirmed</span
                          >
                          <span
                            v-else-if="document.status === 0"
                            class="
                              bg-danger
                              text-white
                              py-1
                              px-2
                              rounded-l-full rounded-r-full
                            "
                            >Not confirmed</span
                          >
                        </div>
                      </div>

                      <div>
                        <p v-if="document.status == 1">
                          Reference:
                          <span class="underline">{{
                            document.reference
                          }}</span>
                        </p>
                        <p
                          v-else-if="document.status == 0"
                          class="text-danger opacity-80"
                        >
                          Rejection message: "{{ document.rejectionMessage }}""
                        </p>
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
                    class="
                      flex
                      items-center
                      space-x-2
                      font-semibold
                      text-secondary
                      leading-8
                      mb-3
                    "
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
                      class="
                        grid grid-cols-auto
                        gap-2
                        items-center
                        border border-tertiary
                        rounded-md
                        p-2
                        my-2
                        w-fit
                      "
                    >
                      <h2 class="text-md font-bold text-center underline">
                        {{ vehicle.numberPlate }}
                      </h2>
                      <ul class="text-sm text-secondary">
                        <li>
                          Type:
                          <span class="text-primary capitalize">{{
                            vehicle.type
                          }}</span>
                        </li>
                        <li>
                          Color:
                          <span class="text-primary capitalize">{{
                            vehicle.color
                          }}</span>
                        </li>
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
                class="
                  flex
                  items-center
                  space-x-2
                  font-semibold
                  text-secondary
                  leading-8
                "
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
                class="
                  grid
                  items-center
                  border border-tertiary
                  text-xs
                  rounded-md
                  p-2
                  my-2
                "
              >
                <p>{{ preference.answer }}</p>
              </div>
            </div>
            <!-- Preferences end  -->
          </div>
        </div>
      </div>
      <AlertsLoader v-if="isLoadingData" />

    </div>
  </NuxtLayout>
</template>
