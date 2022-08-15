<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle :title="'Documents/' + user.lastName + ' ' + user.firstName" />
      <!-- stats card -->
      <div class="w-full mt-6 flex gap-4">
        <div class="w-1/3 bg-white shadow-md p-8">
          <h1>User Infos</h1>
        <UserInfos :data="user" :edit="true" />
          <!--  -->
        </div>
        <div class="w-2/3 bg-white shadow-md p-8">
          <h1>Stats</h1>
       
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { IUser } from "~~/types/IUser";

definePageMeta({
  title: "User Details",
  middleware: "auth",
  layout: "private",
});
const route = useRoute();
const user = await getUser(+route.params.id);
</script>