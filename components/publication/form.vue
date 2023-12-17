<script lang="ts" setup>
const form = computed(() => {
  let data = {
    title: null,
  message: null,
  }
 return data;
});

const onReset = () => {
  form.value.title = null;
  form.value.message = null;
};
</script>
    
    
    <template>
  <div class="w-full bg-white shadow-sm p-2 my-2">
    <div>
      <div class="p-2">
        <input
          placeholder="Titre"
          type="text"
          class="w-full border p-2 rounded text-lg"
          v-model="form.title"
        />
      </div>

      <div class="p-2">
        <textarea
          placeholder="Entrer le message"
          class="w-full border p-2 rounded text-lg"
          v-model="form.message"
          rows="6"
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
        @click="$emit('onValidate', form)"
        class="rounded-md px-2 py-1 text-white bg-green-500"
      >
        Publier
      </button>
    </div>
  </div>
</template>