
<script lang="ts" setup>
import { IPromotion } from "~~/types";

definePageMeta({
  title: "Promotions",
  middleware: "auth",
  layout: "private",
});

const promotions = useState<IPromotion[]>("promotions");

getPromotions();
const rightSidePanel = ref();

const onAddPromotion= async (body: Partial<IPromotion>) => {
  await addPromotion(body);
  rightSidePanel.value.onClose();
};
const onEditPromotion = (body: Partial<IPromotion>) => updatePromotion(body);
const onDeleteQuestion = (id: number) => deletePromotion({ id });


</script>
<template>
  <!-- <NuxtLayout> -->
    <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto">
      <!-- page title -->
      <Pagetitle title="Promotions" />
      <!-- stats card -->
      <div class="w-full mt-6 grid grid-cols-2 justify-center gap-2">
        <PromotionItem
          v-for="promotion of promotions"
          :key="promotion.id"
          :data="promotion"
          :edit="true"
          :deleteMode="true"
          @onValidate="onEditPromotion"
          @onDelete="onDeleteQuestion"
        />
      </div>
    </div>
    <RightSidePanel title="Add Preference" ref="rightSidePanel">
      <PromotionForm
        @onValidate="onAddPromotion"
      />
    </RightSidePanel>
  <!-- </NuxtLayout> -->
</template>
