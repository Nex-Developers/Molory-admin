<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle title="Settings/Vehicle Types" />
      <!-- stats card -->
      <div class="w-full mt-6 grid grid-cols-3 justify-center gap-2">
        <InfosCard
          v-for="vehicleType of vehicleTypes"
          :key="vehicleType.id"
          :id="vehicleType.id"
          :title="vehicleType.name"
          :description="vehicleType.description"
          :maxSeats="vehicleType.maxSeats"
          :edit="true"
          :deleteMode="true"
          @onValidate="onEditVehicleType"
        />
      </div>
    </div>
    <RightSidePanel title="Add Vehicle Type" ref="rightSidePanel">
      <InfosCard
        :maxSeats="4"
        :edit="true"
        :editMode="true"
        @onValidate="onAddVehicleType"
      />
    </RightSidePanel>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { IVehicleType } from "~~/types";

definePageMeta({
  title: "Vehicles Types",
  middleware: "auth",
  layout: "private",
});

const vehicleTypes = useState<IVehicleType[]>("vehicleTypes");

const details = (id) => {
  const router = useRouter();
  router.push("/trips/" + id);
};

getVehicleTypes();
const rightSidePanel = ref();

const onAddVehicleType = async (form) => {
  const body = {
    name: form.title,
    description: form.description,
    maxSeats: form.maxSeats,
  };
  await addVehicleType(body);
  rightSidePanel.value.onClose();
};
const onEditVehicleType = (form) => {
  const body = {
    id: form.id,
    name: form.title,
    description: form.description,
    maxSeats: form.maxSeats,
  };
  updateVehicleType(body);
};
const onDeleteVehicleType = (id) => deleteVehicleType({ id });
</script>