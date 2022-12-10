<script lang="ts" setup>
import { IQuestion } from "~~/types";

definePageMeta({
  title: "Preferences",
  middleware: "auth",
  layout: "private",
});

const questions = useState<IQuestion[]>("questions");

getQuestions();
const rightSidePanel = ref();

const onAddQuestion= async (body) => {
  await addQuestion(body);
  rightSidePanel.value.onClose();
};
const onAddAnswer = async ({ questionId, value }) => {
  await addAnswer({questionId, value})
}
const onEditQuestion = (body) => updateQuestion(body);
const onEditAnswer = ({id, value}) => updateAnswer({id, value});
const onDeleteQuestion = (id) => deleteQuestion({ id });
</script>
<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto">
      <!-- page title -->
      <Pagetitle title="Settings/Preferences" />
      <!-- stats card -->
      <div class="w-full mt-6 grid grid-cols-2 justify-center gap-2">
        <PreferenceItem
          v-for="question of questions"
          :key="question.id"
          :id="question.id"
          :question="question.value"
          :answers="question.answers"
          :edit="true"
          :deleteMode="true"
          @onValidate="onEditQuestion"
          @onAddAnswer="onAddAnswer"
          @onEditAnswer="onEditAnswer"
        />
      </div>
    </div>
    <RightSidePanel title="Add Preference" ref="rightSidePanel">
      <PreferenceForm
        @onValidate="onAddQuestion"
      />
    </RightSidePanel>
  </NuxtLayout>
</template>
