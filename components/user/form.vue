<script lang="ts" setup>
    const form = ref({
        firstName: null,
        lastName: null,
        birthDay: null,
        role: 'admin',
        phoneNumber: null,
        email: null,
        password: null
    });
    
    const onReset = () => {
      form.value.firstName = null;
      form.value.lastName = null;
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
            >
          </div>
          <div class="p-2">
            <input
              placeholder="Last name"
              class="w-full border p-2 rounded text-lg"
              v-model="form.lastName"
              type="text"
            >
          </div>
    
          <div class="p-2">
            <input
              placeholder="Email"
              class="w-full border p-2 rounded text-lg"
              v-model="form.email"
              type="email"
            >
          </div>

          <div class="p-2">
            <input
              placeholder="Password"
              class="w-full border p-2 rounded text-lg"
              v-model="form.password"
              type="password"
            >
          </div>
    

          <div class="p-2">
            <input
              placeholder="Phone number"
              class="w-full border p-2 rounded text-lg"
              v-model="form.phoneNumber"
              type="tel"
            >
          </div>

          <div class="p-2">
            <input
              placeholder="Birth date"
              class="w-full border p-2 rounded text-lg"
              v-model="form.birthDay"
              type="date"
            >
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