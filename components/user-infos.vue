<script lang="ts" setup>
const props = defineProps({
  data: Object,
  edit: {
    type: Boolean,
    default: false,
  },
});

const form = computed(() => {
  return {
    id: props.data.id,
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

const onEdit = () => {
  editMode.value = true;
};

const onValidate = () => {
  editMode.value = false;
  console.log(form.value);
  updateUser(form.value);
};

const onCancel = () => {
  editMode.value = false;
};
</script>


<template>

  <div class="bg-white w-full pb-4  border-t-4 rounded-sm border-primary">
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
        <span class="text-primary ml-auto">{{ data.createdAt}}</span>
      </li>
    </ul>
    <div v-if="edit && !editMode" class="flex justify-center mt-4">
      <button
        @click="onEdit"
        class="rounded-md px-2 py-1 text-white bg-blue-500"
      >
        Modifier
      </button>
    </div>
    <div v-if="editMode" class="flex justify-center gap-4 mt-4">
      <button
        @click="onCancel"
        class="rounded-md px-2 py-1 text-white bg-red-500"
      >
        Annuler
      </button>
      <button
        @click="onValidate"
        class="rounded-md px-2 py-1 text-white bg-green-500"
      >
        Valider
      </button>
    </div>
  </div>
  <!-- End of profile card -->
</template>