<script lang="ts" setup>
const form = ref({
  question: null,
  answer: null,
});

const onReset = () => {
  form.value.question = null;
  form.value.answer = null;
};
</script>
    
    
    <template>
  <div class="w-full bg-white shadow-sm p-2 my-2">
    <div>
      <div class="p-2">
        <textarea
          placeholder="Enter A Question"
          class="w-full border p-2 rounded text-lg"
          v-model="form.question"
          rows="2"
        ></textarea>
      </div>

      <div class="p-2">
        <textarea
          class="w-full p-2 border rounded text-lg"
          v-model="form.answer"
          placeholder="Enter the answer"
          rows="2"
        ></textarea>
      </div>
    </div>

    <div class="flex justify-center gap-4 mt-4">
      <button
        @click="onReset"
        class="rounded-md px-2 py-1 text-white bg-red-500"
      >
        Reset
      </button>
      <button
        @click="$emit('onValidate', form) "
        class="rounded-md px-2 py-1 text-white bg-green-500"
      >
        Validate
      </button>
    </div>
  </div>
</template>