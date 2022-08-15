<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle title="Documents" />
      <!-- stats card -->
      <div class="w-full mt-6 bg-white shadow-md">
        <Table :headers="dataTableHeaders" :data="documents" :details="details" />
      </div>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  title: "Documents",
  middleware: "auth",
  layout: "private",
});

// const data = ref([]);
const dataTableHeaders = [
  { label: "Avatar", field: "avatar", type: "image" },
  { label: "First Name", field: "firstName" },
  { label: "Last Name", field: "lastName" },
  { label: "Phone Number", field: "phoneNumber" },
  { label: "Role", field: "role" },
  { label: "ID Card", field: "idCardStatus" },
  { label: "Driver License", field: "driverLicenseStatus" },
];
getDocuments()
// .then((res: any) => {
//   data.value = res.value.data;
//   console.log(data.value);
// });
 const documents = useState<IUser>('documents')
const details = (id) => {
  const router = useRouter();
  console.log(id);
  router.push({
    path: '/documents/'+id,
  });
};

</script>