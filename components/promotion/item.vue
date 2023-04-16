
<script lang="ts" setup>
import { IPromotion } from "~~/types";

    const props = defineProps({
      data: {
        type: Object,
        default: null,
      },

      edit: {
        type: Boolean,
        default: false,
      },
      editMode: {
        type: Boolean,
        default: false,
      },
      deleteMode: {
        type: Boolean,
        default: false,
      },
    });
    let editMode = ref(props.editMode);
    
    const form = computed(() => {
      let data: any = {
        id: props.data.id,
        name: copyValue(props.data.name),
        description: copyValue(props.data.description),
      };
      if (props.data.discount) {
        data["discount"] = copyValue(props.data.discount);
      }
    
      return data;
    });
    
    const copyValue = (val: any) => {
      return JSON.parse(JSON.stringify(val));
    };
    // const set =  (field: string, value: string) => {
    //     $emit('update', field, value);
    //   }
    
    const onEdit = () => (editMode.value = true);
    const onStopEditing = () => (editMode.value = false);
    </script>
    
    
    <template>
      <div class="w-full bg-white shadow-sm p-2 my-2">
       
        <div>
          <div class="p-2 flex justify-between items-start">
            <input
              v-if="editMode"
              placeholder="Enter A name"
              type="text"
              class="w-full border p-2 rounded text-lg"
              v-model="form.name"
            />
            <h2 class="text-primary" v-else>{{ data.name }}</h2>
            <div v-if="!editMode">
              <button
                @click="onEdit"
                class="rounded-md p-1 text-black"
                v-if="edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-current"
                  viewBox="0 0 512 512"
                >
                  <title>Edit</title>
                  <path
                    d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="32"
                  />
                  <path
                    d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z"
                  />
                </svg>
              </button>
              <button
                @click="$emit('onDelete', data.id)"
                class="rounded-md p-1 text-red-500"
                v-if="deleteMode"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-current"
                  viewBox="0 0 512 512"
                >
                  <title>Trash</title>
                  <path
                    d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="32"
                  />
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="32"
                    d="M80 112h352"
                  />
                  <path
                    d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="32"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="px-2 py-0 flex justify-between items-start" v-if="data.discount">
            <input
              v-if="editMode"
              placeholder="Enter le pourcentage"
              type="number"
              class="w-full border p-2 rounded text-lg"
              v-model="form.discount"
              disabled
            />
            <h3 class="text-black text-sm" v-else>{{ data.discount * 100 }} %</h3>
          
          </div>
          <div class="p-2">
            <textarea
              class="w-full p-2 border rounded text-lg"
              v-if="editMode"
              v-model="form.description"
              placeholder="Enter a Description"
              rows="4"
            ></textarea>
            <p v-else class="text-sm text-gray-400">{{ data.description }}</p>
          </div>
        </div>
    
        <div v-if="editMode" class="flex justify-center gap-4 mt-4">
          <button
            @click="onStopEditing"
            class="rounded-md px-2 py-1 text-white bg-red-500"
          >
            Cancel
          </button>
          <button
            @click="
              () => {
                onStopEditing();
                $emit('onValidate', form);
              }
            "
            class="rounded-md px-2 py-1 text-white bg-green-500"
          >
            Validate
          </button>
        </div>
      </div>
    </template>