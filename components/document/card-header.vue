<script lang="ts" setup>
    const props = defineProps({
      title: String,
      status: Number,
    });
    </script>
    <template>
      <div class="flex justify-between items-center p-2">
        <h2 class="text-center">{{ title }}</h2>
    
        <div class="px-2 py-1 ronded-xl items-center gap-2 flex">
          <div
            :class="{
              'w-2 h-2 rounded-full': true,
              'bg-red-500': !status,
              'bg-green-500': status == 1,
              'bg-yellow-500': status == 2,
            }"
          ></div>
          <span v-if="status==1">Confirmed</span>
          <span v-else-if="status==2">Waiting...</span>
          <span v-else>Not Confirmed!</span>
        </div>
      </div>
    </template>
    