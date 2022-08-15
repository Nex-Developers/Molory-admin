<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle title="Users" />
      <!-- stats card -->
    <div class="w-full mt-6 bg-white shadow-md">
      <Table :headers="usersTableHeaders" :data="users" :details="details" />
    </div>

    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { IUser } from '~~/types/IUser';

definePageMeta({
  title: "Utilisateurs",
  middleware: "auth",
  layout: "private",
});

const users = useState<IUser[]>('users');
const usersTableHeaders = [
  { label: "Avatar", field: "avatar", type: "image" },
  { label: "First Name", field: "firstName" },
  { label: "Last Name", field: "lastName" },
  { label: "Phone Number", field: "phoneNumber" },
  { label: "Role", field: "role" },
];
const details = (id) => {
  const router = useRouter()
  router.push('/users/'+id)
}

getUsers()
</script>