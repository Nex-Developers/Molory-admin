<script lang="ts" setup>
const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  question: {
    type: String,
    default: null,
  },
  answers: {
    type: Array,
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
let addAnswerMode = ref(false);
const Questionform = computed(() => {
  let data: any = {
    id: props.id,
    value: copyValue(props.question),
    // answer: copyValue(props.answer),
  };

  return data;
});

const answer = ref("");
const copyValue = (val: any) => {
  return JSON.parse(JSON.stringify(val));
};
// const set =  (field: string, value: string) => {
//     $emit('update', field, value);
//   }
const onAddAnswer = () => (addAnswerMode.value = true);
const onStopAdding = () => (addAnswerMode.value = false);
const onEdit = () => (editMode.value = true);
const onStopEditing = () => (editMode.value = false);
</script>
    
    
    <template>
  <div class="w-full bg-white shadow-sm p-2 my-2">
    <div>
      <div class="p-2 flex justify-between items-start">
        <div v-if="editMode" class="w-full">
          <textarea
            placeholder="Enter A Question"
            class="w-full border p-2 rounded text-lg"
            v-model="Questionform.value"
            rows="2"
          ></textarea>
          <div class="flex justify-center gap-4 mb-4">
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
                  $emit('onValidate', { id, value: Questionform.value});
                }
              "
              class="rounded-md px-2 py-1 text-white bg-green-500"
            >
              Validate
            </button>
          </div>
        </div>
        <h2 class="text-primary" v-else>{{ question }}</h2>
        <div class="flex justify-between" v-if="!editMode">
          <button
            @click="onAddAnswer"
            class="rounded-md p-1 text-black"
            v-if="edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 fill-current"
              viewBox="0 0 512 512"
            >
              <title>Add</title>
              <path
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                fill="none"
                stroke="currentColor"
                stroke-miterlimit="10"
                stroke-width="32"
              />
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M256 176v160M336 256H176"
              />
            </svg>
          </button>
          <button @click="onEdit" class="rounded-md p-1 text-black" v-if="edit">
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
            @click="$emit('onDelete', id)"
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

      <div class="p-2" v-if="addAnswerMode">
        <textarea
          placeholder="Enter An Answer"
          class="w-full border p-2 rounded text-lg"
          v-model="answer"
          rows="2"
        ></textarea>
      </div>
      <div v-if="addAnswerMode" class="flex justify-center gap-4 mb-4">
        <button
          @click="onStopAdding"
          class="rounded-md px-2 py-1 text-white bg-red-500"
        >
          Cancel
        </button>
        <button
          @click="
            () => {
              onStopAdding();
              $emit('onAddAnswer', { questionId: id, value: answer });
            }
          "
          class="rounded-md px-2 py-1 text-white bg-green-500"
        >
          Validate
        </button>
      </div>
      <div class="p-2" v-for="answer of answers" :key="answer.id">
        <div v-if="answer.editMode">
          <textarea
            class="w-full p-2 border rounded text-lg"
            v-model="answer.value"
            placeholder="Enter the answer"
            rows="2"
          ></textarea>
          <div class="flex justify-center gap-4 mb-4">
            <button
              @click="answer.editMode = false"
              class="rounded-md px-2 py-1 text-white bg-red-500"
            >
              Cancel
            </button>
            <button
              @click="
                () => {
                  answer.editMode = false;
                  $emit('onEditAnswer', { id: answer.id, value: answer.value });
                }
              "
              class="rounded-md px-2 py-1 text-white bg-green-500"
            >
              Validate
            </button>
          </div>
        </div>
        <div
          v-else
          class="
            text-sm text-gray-400
            border-l-4
            p-2
            border-primary
            bg-gray-50
            flex
            justify-between
          "
        >
          <p>{{ answer.index + 1}} - {{ answer.value }}</p>
          <div class="flex">
            <button
              @click="answer.editMode = true"
              class="rounded-md p-1 text-black"
              v-if="edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 fill-current"
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
              @click="$emit('onDeleteAnswer', id)"
              class="rounded-md p-1 text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 fill-current"
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
      </div>
    </div>
  </div>
</template>