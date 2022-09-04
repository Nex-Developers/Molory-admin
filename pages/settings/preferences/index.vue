<script lang="ts" setup>
import { IPreference } from "~~/types";

definePageMeta({
  title: "Preferences",
  middleware: "auth",
  layout: "private",
});

const preferences = useState<IPreference[]>("preferences");

getPreferences();
const rightSidePanel = ref();

const onAddPreference = async (body) => {
  await addPreference(body);
  rightSidePanel.value.onClose();
};
const onEditPreference = (body) => updatePreference(body);
const onDeletePreference = (id) => deletePreference({ id });
</script>
<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle title="Settings/Preferences" />
      <!-- stats card -->
      <div class="w-full mt-6 grid grid-cols-3 justify-center gap-2">
        <PreferenceItem
          v-for="preference of preferences"
          :key="preference.id"
          :id="preference.id"
          :question="preference.question"
          :answer="preference.answer"
          :edit="true"
          :deleteMode="true"
          @onValidate="onEditPreference"
        />
      </div>
    </div>
    <RightSidePanel title="Add Preference" ref="rightSidePanel">
      <PreferenceForm
        @onValidate="onAddPreference"
      />
    </RightSidePanel>
  </NuxtLayout>
</template>
