<script lang="ts" setup>
    
    const form = ref({
        name: null,
        description: null,
        maxSeats: null
      });
    
    const onReset = () =>{
        form.value.name = null;
        form.value.description = null;
        form.value.maxSeats = null;
    };
    </script>
    
    
    <template>
      <div class="w-full bg-white shadow-sm p-2 my-2">
       
        <div>
          <div class="p-2 flex justify-between items-start">
            <input
              placeholder="Enter A name"
              type="text"
              class="w-full border p-2 rounded text-lg"
              v-model="form.name"
            />
    
          </div>
          <div class="px-2 py-0 flex justify-between items-start">
            <input
              placeholder="Enter Maximum Seats"
              type="number"
              class="w-full border p-2 rounded text-lg"
              v-model="form.maxSeats"
            />          
          </div>
          <div class="p-2">
            <textarea
              class="w-full p-2 border rounded text-lg"
              v-model="form.description"
              placeholder="Enter a Description"
              rows="4"
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
            Validate
          </button>
        </div>
      </div>
    </template>