<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    require: true,
  },
});

const compare = (a, b) => {
  if (a.lowerDistance < b.lowerDistance) {
    return -1;
  }
  if (a.lowerDistance > b.lowerDistance) {
    return 1;
  }
  return 0;
};

const pricings = computed(() => props.data.pricings.sort(compare));
const onAddRow = () => {
  pricings.value.push({
    vehicleTypeName: props.data.name,
    lowerDistance: null,
    upperDistance: null,
    unitPrice: null,
    isEditing: true,
  });
};

const onCancel = (index, id) => {
  if (id) props.data.pricings[index].isEditing = false;
  else props.data.pricings.splice(index, 1);
};

const onSave = (pricing) => {
  if (pricing.id) updatePricing(pricing);
  else addPricing(pricing);
};

const onDelete = (id) => deletePricing({ id });
</script>
    
    <template>
  <div class="w-full bg-white shadow-sm p-2 my-2">
    <div class="w-full relative items-start">
      <h3 class="text-lg text-primary text-center">
        {{ data.name }}
        <span class="text-secondary">({{ data.maxSeats }} max seats/trip)</span>
      </h3>
      <div>
        <button class="absolute right-0 top-0" @click="onAddRow">
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
      </div>
    </div>
    <div class="w-full mt-5">
      <table v-if="data.pricings.length">
        <thead>
          <th>From(Km)</th>
          <th>To(Km)</th>
          <th>Amount(F/Km)</th>
          <th>Actions</th>
        </thead>
        <tbody>
          <tr v-for="(pricing, index) in pricings" :key="pricing.id">
            <td>
              <span v-if="!pricing.isEditing">{{ pricing.lowerDistance }}</span>
              <input
                v-model.number="pricing.lowerDistance"
                placeholder="Lower Distance"
                v-else
              />
            </td>
            <td>
              <span v-if="!pricing.isEditing">{{ pricing.upperDistance }}</span>
              <input
                v-model.number="pricing.upperDistance"
                placeholder="Upper distance"
                v-else
              />
            </td>
            <td>
              <span v-if="!pricing.isEditing">{{ pricing.unitPrice }}</span>
              <input
                v-model.number="pricing.unitPrice"
                placeholder="Unit price"
                v-else
              />
            </td>
            <td>
              <button
                class="mx-2 text-gray-400"
                v-if="!pricing.isEditing"
                @click="pricing.isEditing = true"
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
                v-else
                class="mx-2 text-green-700"
                @click="onSave(pricing)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-current"
                  viewBox="0 0 512 512"
                >
                  <title>Save</title>
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
                    d="M352 176L217.6 336 160 272"
                  />
                </svg>
              </button>
              <button
                class="mx-2 text-red-500"
                v-if="pricing.isEditing"
                @click="onCancel(index, pricing.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-current"
                  viewBox="0 0 512 512"
                >
                  <title>Cancel</title>
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
                    d="M320 320L192 192M192 320l128-128"
                  />
                </svg>
              </button>
              <button
                class="mx-2 text-red-500"
                v-else
                @click="onDelete(pricing.id)"
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
            </td>
          </tr>
        </tbody>
      </table>
      <div class="w-full" v-else>
        <p class="text-center text-gray-400">
          No pricing for this vehicle type! Clique on the button "+" on the top
          of the card to add a pricing.
        </p>
      </div>
    </div>
  </div>
</template>
    
    <style>
td {
  width: 240px;
  text-align: center;
}

input {
  text-align: center;
}
</style>
    