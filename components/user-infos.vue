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
  <div class="w-full">
    <div class="w-full grid place-items-center my-8">
      <div class="w-24 h-24 rounded-full border border-secondary">
        <img
          :src="data.avatar || '/img/user.jpeg'"
          class="w-full h-full rounded-full"
          alt=""
        />
      </div>
    </div>
    <div class="flex border-b text-sm border-gray-200 py-4 gap-8">
      <div class="w-28">First Name</div>
      <div class="text-primary">
        <input v-if="editMode" type="text" v-model="form.firstName" />
        <span v-else> {{ data.firstName }}</span>
      </div>
    </div>
    <div class="flex border-b text-sm border-gray-200 py-4 gap-8">
      <div class="w-28">Last Name</div>
      <div class="text-primary">
        <input v-if="editMode" type="text" v-model="form.lastName" />
        <span v-else> {{ data.lastName }}</span>
      </div>
    </div>
    <div class="flex border-b text-sm border-gray-200 py-4 gap-8">
      <div class="w-28">Phone Number</div>
      <div class="text-primary">
        {{ data.phoneNumber }}
      </div>
    </div>
    <div class="flex border-b text-sm border-gray-200 py-4 gap-8">
      <div class="w-28">Gender</div>
      <div class="text-primary">
        <input v-if="editMode" type="text" v-model="form.gender" />
        <span v-else> {{ data.gender }}</span>
      </div>
    </div>
    <div class="flex border-b text-sm border-gray-200 py-4 gap-8">
      <div class="w-28">Birthday</div>
      <div class="text-primary">
          <input v-if="editMode" type="text" v-model="form.birthDay" />
        <span v-else> {{ data.birthDay }}</span>
      </div>
    </div>
    <div class="flex border-b text-sm border-gray-200 py-4 gap-8">
      <div class="w-28">Role</div>
      <div class="text-primary">
        {{ data.role }}
      </div>
    </div>
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
</template>