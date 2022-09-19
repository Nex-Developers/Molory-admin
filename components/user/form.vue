<script lang="ts" setup>
const props = defineProps({
  isLoading: Boolean,
});
const form = ref({
  firstName: null,
  lastName: null,
  birthDay: null,
  role: "admin",
  phoneNumber: null,
  email: null,
  password: null,
});

const onReset = () => {
  form.value.firstName = null;
  form.value.lastName = null;
  form.value.birthDay = null;
  form.value.phoneNumber = null;
  form.value.email = null;
  form.value.password = null;
};
</script>
        
        
        <template>
  <div class="w-full bg-white shadow-sm p-2 my-2">
    <div>
      <div class="p-2">
        <input
          placeholder="First name"
          class="w-full border p-2 rounded text-lg"
          v-model="form.firstName"
          type="text"
        />
      </div>
      <div class="p-2">
        <input
          placeholder="Last name"
          class="w-full border p-2 rounded text-lg"
          v-model="form.lastName"
          type="text"
        />
      </div>

      <div class="p-2">
        <input
          placeholder="Email"
          class="w-full border p-2 rounded text-lg"
          v-model="form.email"
          type="email"
        />
      </div>

      <div class="p-2">
        <input
          placeholder="Password"
          class="w-full border p-2 rounded text-lg"
          v-model="form.password"
          type="password"
        />
      </div>

      <div class="p-2">
        <input
          placeholder="Phone number"
          class="w-full border p-2 rounded text-lg"
          v-model="form.phoneNumber"
          type="tel"
        />
      </div>

      <!-- <div class="p-2">
            <input
              placeholder="Birth date"
              class="w-full border p-2 rounded text-lg"
              v-model="form.birthDay"
              type="date"
            >
          </div> -->
    </div>

    <div class="flex w-full justify-center gap-4 mt-8 mb-4 px-2">
      <button
        @click.prevent="onReset"
        class="rounded-md px-2 py-1 text-white bg-red-500 w-1/2"
      >
        Reset
      </button>
      <button
        @click="$emit('onValidate', form)"
        class="rounded-md px-2 py-1 text-white bg-green-500 w-1/2"
        :disabled="isLoading"
      >
        <div class="flex gap-1 justify-center">
          <div role="status" v-if="isLoading" >
            <svg
              class="
                inline
                mr-2
                w-4
                h-4
                text-gray-200
                animate-spin
                dark:text-gray-600
                fill-gray-600
              "
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
          <span class="">Validate</span>
        </div>
      </button>
    </div>
  </div>
</template>