<script lang="ts" setup>
import { IUser } from "~~/types/IUser";

definePageMeta({
  title: "Utilisateurs",
  middleware: "auth",
  layout: "private",
});

const users = useState<IUser[]>("users");
const rightSidePanel = ref();
const usersTableHeaders = [
  { label: "Avatar", field: "avatar", type: "image" },
  { label: "First Name", field: "firstName" },
  { label: "Last Name", field: "lastName" },
  { label: "Phone Number", field: "phoneNumber" },
  { label: "Role", field: "role" },
];
const details = (id) => {
  const router = useRouter();
  router.push("/users/" + id);
};
const onAddUser = async (form) => {
  await addUser(form);
  rightSidePanel.value.onClose();
};
getUsers();
</script>

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
    <RightSidePanel title="Add Admin" ref="rightSidePanel">
      <UserForm @onValidate="onAddUser" />
    </RightSidePanel>
  </NuxtLayout>
</template>
