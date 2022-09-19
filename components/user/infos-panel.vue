<script lang="ts" setup>
const props = defineProps({
  id: Number,
  data: Object,
  edit: {
    type: Boolean,
    default: false,
  },
});

const form = computed(() => {
  return {
    id: props.id,
    firstName: props.data.firstName,
    lastName: props.data.lastName,
    gender: props.data.gender,
    birthDay: props.data.birthDay,
  };
});

// const set =  (field: string, value: string) => {
//     $emit('update', field, value);
//   }
const editMode = ref(false);
const isLoading = ref(false);

const onEdit = () => {
  editMode.value = true;
};

const onValidate = async () => {
  editMode.value = false;
  isLoading.value = true;
  props.data = await updateUser(form.value);
  isLoading.value = false;
  location.reload();
};

const onCancel = () => {
  editMode.value = false;
};
</script>
    
    
    <template>
  <div
    class="bg-white w-full pb-4 text-sm border-t-4 rounded-sm border-primary"
  >
    <div class="image overflow-hidden">
      <img
        class="aspect-square w-full mx-auto"
        :src="data.avatar || '/img/user.jpeg'"
        alt=""
      />
    </div>

    <ul
      class="
        text-gray-600
        hover:text-gray-700 hover:shadow
        py-2
        px-3
        divide-y
        rounded
        shadow-sm
      "
    >
      <li class="flex items-center py-3">
        <span>First Name</span>
        <span class="text-primary ml-auto">
          <input v-if="editMode" type="text" v-model="form.firstName" />
          <span v-else> {{ data.firstName }}</span>
        </span>
      </li>
      <li class="flex items-center py-3">
        <span>Last Name</span>
        <span class="text-primary ml-auto">
          <input v-if="editMode" type="text" v-model="form.lastName" />
          <span v-else> {{ data.lastName }}</span>
        </span>
      </li>
      <li class="flex items-center py-3">
        <span>Phone Number</span>
        <span class="text-primary ml-auto">
          {{ data.phoneNumber }}
        </span>
      </li>
      <li class="flex items-center py-3">
        <span>Email</span>
        <span class="text-primary ml-auto">
          {{ data.email }}
        </span>
      </li>
      <li class="flex items-center py-3">
        <span>Gender</span>
        <span class="text-primary ml-auto">
          <input v-if="editMode" type="text" v-model="form.gender" />
          <span v-else> {{ data.gender }}</span>
        </span>
      </li>
      <li class="flex items-center py-3">
        <span>Birthday</span>
        <span class="text-primary ml-auto">
          <input v-if="editMode" type="text" v-model="form.birthDay" />
          <span v-else> {{ data.birthDay }}</span>
        </span>
      </li>
      <li class="flex items-center py-3">
        <span>Role</span>
        <span class="text-primary ml-auto">
          {{ data.role }}
        </span>
      </li>
      <li class="flex items-center py-3">
        <span>Status</span>
        <span class="ml-auto"
          ><span class="bg-green-500 py-1 px-2 rounded text-white text-sm"
            >Active</span
          ></span
        >
      </li>
      <li class="flex items-center py-3">
        <span>Member since</span>
        <span class="text-primary ml-auto">{{ data.profileCompletedAt }}</span>
      </li>
    </ul>
    <div v-if="edit && !editMode" class="flex justify-center gap-2 w-full px-4 mt-4">
      <button
        @click="onEdit"
        class="rounded-md px-2 py-1 w-full text-white bg-info"
      >
        Edit Infos
      </button>
      <button
        @click="onEdit"
        class="rounded-md px-2 py-1 w-full text-white bg-danger"
      >
        Block User
      </button>
    </div>
    <div v-if="editMode" class="flex w-full px-4 justify-center gap-4 mt-4">
      <button
        @click="onCancel"
        class="rounded-md px-2 py-1 w-full text-white bg-red-500"
      >
        Annuler
      </button>
      <button
        @click="onValidate"
        class="rounded-md px-2 py-1 w-full text-white bg-green-500"
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
  <!-- End of profile card -->
</template>