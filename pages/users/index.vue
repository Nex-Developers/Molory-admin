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
const isFormLoading = ref(false);
const isLoadingData = useState<boolean>("showLoader");
const onAddUser = async (form) => {
  isFormLoading.value = true;
  await addUser(form);
  isFormLoading.value = false;
  rightSidePanel.value.onClose();
};
getUsers();
</script>

<template>
  <!-- <NuxtLayout> -->
    <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto relative">
      <!-- page title -->
      <Pagetitle title="Users" />
      <!-- stats card -->
      <div class="w-full mt-6  ">
        <!-- <Table :headers="usersTableHeaders" :data="users" :details="details" /> -->
        <div id="app" class="">
          <div class="container mx-auto">
            <div class="">
              <div class="flex items-center px-5 py-2">
                <!-- <span class="w-1/6 text-center">          
          <input type="checkbox" @change="toggleSelect">
        </span> -->
                <span class="w-1/2">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >User Infos</span
                  >
                </span>
                <span class="w-1/4">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >Gender</span
                  >
                </span>
                <span class="w-1/4">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >Birth Date</span
                  >
                </span>
                <span class="w-1/4">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >Role</span
                  >
                </span>
                <span class="w-1/4">
                  <span class="text-xs uppercase text-gray-600 font-bold"
                    >Created At</span
                  >
                </span>
              </div>

              <div
                v-for="(contact, key) in users"
                :key="key"
                @click="details(contact.id)"
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
                    <img :src="contact.avatar || 'img/user.jpeg' "  class=" aspect-square w-8 rounded-full" />
                    <div class="ml-4">
                      <span class="capitalize block text-gray-800"
                        >{{ contact.firstName }} {{ contact.lastName }} <span class="text-gray-600 text-xs" >({{ contact.signUpMethod }})</span></span
                      >
                      <span class="text-sm block text-gray-600" v-if="contact.signUpMethod=='phoneNumber'"
                        >{{ contact.phoneNumber }} </span
                      >
                      <span class="text-sm block text-gray-600" v-if="contact.signUpMethod=='email'"
                        >{{ contact.email }} </span
                      >
                    </div>
                  </div>
                </div>
                <div class="w-1/4">
                  <span class="capitalize text-gray-600 text-sm">{{
                    contact.gender
                  }}</span>
                </div>
                <div class="w-1/4">
                  <span class="capitalize text-gray-600 text-sm">{{
                    contact.birthDay
                  }}</span>
                </div>
                <div class="w-1/4">
                  <span class="text-gray-600 text-sm">{{ contact.role }}</span>
                </div>
                <div class="w-1/4">
                  <span class="text-gray-600 text-sm">{{
                    contact.createdAt
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AlertsLoader v-if="isLoadingData" />
      </div>
    </div>
    <RightSidePanel title="Add Admin" ref="rightSidePanel">
      <UserForm @onValidate="onAddUser" :isLoading="isFormLoading" />
    </RightSidePanel>
  <!-- </NuxtLayout> -->
</template>
