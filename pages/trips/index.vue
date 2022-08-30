<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle title="Trajets" />
      <!-- stats card -->
    <div class="w-full mt-6">
        <TripCard v-for="trip in trips"  :key="trip.id" :data="trip" />
    </div>

    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { ITrip } from '~~/types';

definePageMeta({
  title: "Trajets",
  middleware: "auth",
  layout: "private",
});

const trips = useState<ITrip[]>('trips');

const details = (id) => {
  const router = useRouter()
  router.push('/trips/'+id)
}

getTrips()
</script>