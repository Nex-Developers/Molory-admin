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

const trips = useState<ITrip[]>("trips");
const isLoadingData = useState<boolean>("showLoader");

const details = (id) => {
  const router = useRouter();
  router.push("/trips/" + id);
};

getTrips();
</script>