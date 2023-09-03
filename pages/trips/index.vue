<template>
  <!-- <NuxtLayout> -->
    <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto relative">
      <!-- page title -->
      <Pagetitle title="Trajets" />
      <!-- stats card -->
      <div class="w-full mt-6 flex justify-center gap-2">
        <div class="w-3/4">
          <TripCard
            v-for="trip in trips"
            :key="trip.id"
            :data="trip"
            @click="details(trip.id)"
          />
        </div>
      </div>
      <AlertsLoader v-if="isLoadingData" />
    </div>
  <!-- </NuxtLayout> -->
</template>
<script lang="ts" setup>
import { ITrip } from "~~/types";

definePageMeta({
  title: "Trajets",
  middleware: "auth",
  layout: "private",
});


const searchValue = useState<any>("searchValue");
const trips = computed<any[]>(() => {
  const data = useState<ITrip[]>("trips");
  // console.log('travel', data.value)
  if (!data.value) return [];
  if (!data.value.length) return [];
  if (!searchValue.value) return data.value;
  const computedData = data.value.filter(
    item => item?.user?.firstName?.toLowerCase().includes(searchValue.value?.toLowerCase())
  || item?.user?.lastName?.toLowerCase().includes(searchValue.value?.toLowerCase())
  || item?.vehicle?.numberPlate?.toLowerCase().includes(searchValue.value?.toLowerCase())

  );
  // console.log('computed', computedData)
  return computedData;
});
const isLoadingData = useState<boolean>("showLoader");

const details = (id) => {
  const router = useRouter();
  router.push("/trips/" + id);
};


getTrips();
</script>