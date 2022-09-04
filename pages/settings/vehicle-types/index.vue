<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle title="Settings/Vehicle Types" />
      <!-- stats card -->
      <div class="w-full mt-6 grid grid-cols-3 justify-center gap-2">
        <VehicleTypeItem
          v-for="vehicleType of vehicleTypes"
          :key="vehicleType.id"
          :id="vehicleType.id"
          :name="vehicleType.name"
          :description="vehicleType.description"
          :maxSeats="vehicleType.maxSeats"
          :edit="true"
          :deleteMode="true"
          @onValidate="onEditVehicleType"
        />
      </div>
    </div>
    <RightSidePanel title="Add Vehicle Type" ref="rightSidePanel">
      <VehicleTypeForm
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
  await addVehicleType(form);
  rightSidePanel.value.onClose();
};
const onEditVehicleType = (form) => updateVehicleType(form);
const onDeleteVehicleType = (id) => deleteVehicleType({ id });
</script>