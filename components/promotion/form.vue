<script lang="ts" setup>
import { IPromotion } from "~~/types";

    
    const form = ref<Partial<IPromotion>>({});
    
    const onReset = () =>{
       form.value = {}
    };
    </script>
    
    
    <template>
      <div class="w-full bg-white shadow-sm p-2 my-2">
       
        <div>

          <div class="px-2 flex justify-between items-center w-full py-4">
            <label for="">Pour Conducteur</label>
            <input
              placeholder="Nombre maximum de site"
              id="isForDriver"
              type="checkbox"
              class="p-2 rounded text-lg"
              v-model="form.isForDriver"
            />          
          </div>

          <div class="p-2 flex justify-between items-start">
            <input
              placeholder="Code promo"
              type="text"
              class="w-full border p-2 rounded text-lg"
              v-model="form.name"
            />
    
          </div>
         
          <div class="px-2 py-0 flex justify-between items-start">
            <input
              placeholder="Reduction"
              type="number"
              class="w-full border p-2 rounded text-lg"
              v-model="form.discount"
            />          
          </div>
          <div class="px-2 py-0 flex justify-between items-start">
            <input
              placeholder="Nombre maximum d'utilisation"
              type="number"
              class="w-full border p-2 rounded text-lg"
              v-model="form.limit"
            />          
          </div>
          <div class="p-2">
            <textarea
              class="w-full p-2 border rounded text-lg"
              v-model="form.description"
              placeholder="Entrer une Description"
              rows="4"
            ></textarea>
          </div>
          <!-- <div class="px-2 py-0 flex justify-between items-start">
            <input
              placeholder="Date de debut"
              type="date"
              class="w-full border p-2 rounded text-lg"
              v-model="form.startAt"
            />          
          </div>
          <div class="px-2 py-2 flex justify-between items-start">
            <input
              placeholder="Date de fin"
              type="date"
              class="w-full border p-2 rounded text-lg"
              v-model="form.endAt"
            />          
          </div> -->
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