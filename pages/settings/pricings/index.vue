<script lang="ts" setup>
import { IPricing } from "~~/types";

definePageMeta({
  title: "Pricings",
  middleware: "auth",
  layout: "private",
});

const pricings = useState<{ name: string; pricings: IPricing[]}[]>("pricings");
getPricings()
</script>
<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto">
      <!-- page title -->
      <Pagetitle title="Settings/Pricings" />
      <!-- stats card -->
      <div class="w-full mt-6 flex justify-center gap-2">
          <div class="w-3/4">
              <PricingItem v-for="pricing in pricings" :key="pricing.name" :data="pricing"  />
          </div>
      </div>
    </div>
   
  </NuxtLayout>
</template>
