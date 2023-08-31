<template>
  <!-- <NuxtLayout> -->
    <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto">
      <!-- page title -->
      <Pagetitle :title="'Trips/' + trip.id" />
      <!-- stats card -->
      <div class="w-full mt-6">
        <div class="md:flex no-wrap md:-mx-2">
          <!-- Left Side -->
          <div class="w-full md:w-3/12 md:mx-2">
            <!-- Profile Card -->

            <UserInfos :data="user" :id="user.id"></UserInfos>
            <div class="my-4"></div>
          </div>
          <!-- Right Side -->
          <div class="w-full space-y-4 md:w-9/12 mx-2 h-64">
            <!-- Stats tab -->
            <div class="grid grid-cols-4 gap-4">
              <div class="bg-white p-3 shadow-sm rounded-sm">
                <span v-if="trip.status === 0" class="text-danger">Annulé</span>
                <span v-else-if="trip.status === 1" class="text-success">Arrivé</span>
                <span v-else-if="trip.status === 2" class="text-primary" >En cours</span>
                <span v-else-if="trip.status === 3" class="text-secondary" >En attente</span>
              </div>

              <div class="bg-white p-3 shadow-sm rounded-sm">
                <span>{{ trip.departureDate }}</span
                ><br />
                <span> {{ trip.departureTime }}</span>
                <!-- icon watch -->
              </div>

              <div class="bg-white p-3 shadow-sm rounded-sm">
                <span>{{ amount  }} F <br> gagné</span>
                <!-- icon dollar -->
              </div>

              <div class="bg-white p-3 shadow-sm rounded-sm">
                <span
                  >{{ trip.seats - trip.remainingSeats }}/{{ trip.seats }}</span
                >
                <!-- icon users -->
              </div>
            </div>
            <!-- About Section -->
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
                    <title>Pin</title>
                    <path
                      d="M339 99a83 83 0 10-102 80.8V464l19 32 19-32V179.8A83.28 83.28 0 00339 99zm-59-6a21 21 0 1121-21 21 21 0 01-21 21z"
                    />
                  </svg>
                </span>
                <span class="tracking-wide">Routes</span>
              </div>
              <div
                class="
                  grid grid-cols-3
                  items-center
                  border border-tertiary
                  text-xs
                  rounded-md
                  p-2
                "
              >
                <div class="text-center">
                  <span>{{ trip.route.stops[0].address }}</span>
                </div>
                <div>
                  <div class="text-center text-sm text-primary">
                    <span> {{ trip.route.price + trip.route.commission }} F</span>
                  </div>
                  <hr class="w-full" />
                  <div class="text-center">
                    <span
                      >{{ trip.route.distance }} km ~ {{ trip.route.duration }} h</span
                    >
                  </div>
                </div>
                <div class="text-center">
                  <span>{{ trip.route.stops[1].address }}</span>
                </div>
              </div>
              <!-- <button
                class="
                  block
                  w-full
                  text-red-500 text-sm
                  font-semibold
                  rounded-lg
                  hover:bg-gray-100
                  focus:outline-none focus:shadow-outline focus:bg-gray-100
                  hover:shadow-xs
                  p-3
                  my-4
                "
              >
                Cancel Travel
              </button> -->
            </div>
            <!-- End of about section -->

            <div class="my-4"></div>

            <!-- Experience and education -->
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
                        class="w-6 h-6 fill-current"
                        viewBox="0 0 512 512"
                      >
                        <title>People</title>
                        <path
                          d="M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 26.37-72 66-72s69 30.46 66 72z"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="32"
                        />
                        <path
                          d="M336 304c-65.17 0-127.84 32.37-143.54 95.41-2.08 8.34 3.15 16.59 11.72 16.59h263.65c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304z"
                          fill="none"
                          stroke="currentColor"
                          stroke-miterlimit="10"
                          stroke-width="32"
                        />
                        <path
                          d="M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 115.34 128 147 128s55.39 24.77 53 57.94z"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="32"
                        />
                        <path
                          d="M206 306c-18.05-8.27-37.93-11.45-59-11.45-52 0-102.1 25.85-114.65 76.2-1.65 6.66 2.53 13.25 9.37 13.25H154"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-miterlimit="10"
                          stroke-width="32"
                        />
                      </svg>
                    </span>
                    <span class="tracking-wide">Travelers</span>
                  </div>
                  <div>
                    <div
                      v-for="item in trip.passengers"
                      :key="item.user.id"
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
                      "
                    >
                      <!-- <div class="w-1/6 text-center"><input type="checkbox" v-model="contact.selected"></div> -->
                      <div class="w-1/2">
                        <div class="flex items-center">
                          <img
                            :src="item.user.avatar || '/img/user.jpeg'"
                            class="aspect-square w-8 rounded-full"
                          />
                          <div class="ml-4">
                            <span class="capitalize block text-gray-800"
                              >{{ item.user.firstName }}
                              {{ item.user.lastName }}
                            </span>
                            <span class="text-sm block text-gray-600"
                              >{{ item.user.phoneNumber }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <!-- <div class="w-1/4">
                        <span class="capitalize text-gray-600 text-sm">{{
                          item.user.phoneNumber
                        }}</span>
                      </div> -->
                      <div class="w-1/2">
                        <div class="flex justify-around items-center text-xs">
                          <span>{{ item.travel.route.stops[0].address }}</span>
                          <hr class="w-12">
                          <span>{{ item.travel.route.stops[1].address }}</span>
                        </div>
                        <div class="capitalize text-gray-600 text-sm pt-2 text-center">{{
                          item.travel.createdAt
                        }}</div>
                      </div>
                      <div class="w-1/4">
                        <span class="text-gray-600 text-sm">{{
                          item.travel.seats
                        }} seats</span>
                      </div>
                      <div class="w-1/4">
                        <span class="text-gray-600 text-sm">{{
                          item.travel.status
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End of Experience and education grid -->
            </div>
            <!-- End of profile tab -->
          </div>
        </div>
      </div>
    </div>
  <!-- </NuxtLayout> -->
</template>
<script lang="ts" setup>
definePageMeta({
  title: "Trip Details",
  middleware: "auth",
  layout: "private",
});
const route = useRoute();
const trip = await getTrip(+route.params.id);
console.log(trip)
const user = await getUser(trip.user.id);
const amount = trip.passengers.reduce((a: any,b: any) => a + (b.travel.route.price), 0)
</script>