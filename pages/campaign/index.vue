<template>
    <!-- <NuxtLayout> -->
      <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto relative">
        <!-- page title -->
        <Pagetitle title="Campagnes" />
        <!-- stats card -->
        <div class="w-full mt-6 space-y-4 ">
          <div class="w-full bg-white shadow-sm rounded p-4 space-y-2 " v-for="campaign in campaigns" :key="campaign.id">
            <div class="flex justify-between">
                <h3 class="text-primary text-lg font-bold">{{ campaign.title }}</h3>
                <span class="">{{ campaign.createdAt }}</span>
            </div>
            <div class="text-dark italic"><blockquote>{{ campaign.message }} </blockquote></div>
            <div class=" flex justify-between">
                <h4>Publié par <span class="font-bold"> {{ campaign.user.firstName }} {{ campaign.user.lastName }}</span> </h4>
                <span> {{ campaign.notifications.length }} reception(s)</span>
            </div>
          </div>
        </div>
        <AlertsLoader v-if="isLoadingData" />
      </div>
      <RightSidePanel title="Effectuer une campagne" ref="rightSidePanel">
      <PublicationForm
        @onValidate="onPublish"
      />
    </RightSidePanel>
    <!-- </NuxtLayout> -->
  </template>
  <script lang="ts" setup>
import { IPublication } from "~~/types";

  definePageMeta({
    title: "Campagnes",
    middleware: "auth",
    layout: "private",
  });
  
  // const data = ref([]);
  
  
  const isLoadingData = useState<boolean>('showLoader');
  
  getPublications()
  const rightSidePanel = ref();
  // .then((res: any) => {
  //   data.value = res.value.data;
  //   console.log(data.value);
  // });
   const campaigns = useState<IPublication[]>('publications')

    const onPublish = async (body)=> {
       await  addPublication(body)
       rightSidePanel.value.onClose()
    }
  
  </script>