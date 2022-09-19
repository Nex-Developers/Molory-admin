<script lang="ts" setup>
const user = useState<IUser>("user");
const load = () => {
  showLoader(true, 'chargement')
}
</script>


<template>
  <div class="w-full flex h-20 border-b border-gray-200">
    <div class="grid place-items-center w-20">
      <img src="/img/logo1.png" class="w-8 h-8" alt="" />
    </div>
    <div class="my-auto w-full flex justify-between px-10">
      <div class="flex items-center bg-medium px-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 fill-current text-gray-600"
            viewBox="0 0 512 512"
          >
            <title>Search</title>
            <path
              d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
              d="M338.29 338.29L448 448"
            />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Search for transaction, item,"
          class="p-2 bg-medium w-80 rounded-none"
        />
        <button class="w-36 bg-primary text-light py-2" @click="load">Rechercher</button>
      </div>
      <div class="flex">
        <div>
          <!-- svg notification-->
          <button class="bg-transparent relative h-10 w-1">
            <svg
              class="h-6 w-6 fill-current text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <title>Notifications</title>
              <path
                d="M427.68 351.43C402 320 383.87 304 383.87 217.35 383.87 138 343.35 109.73 310 96c-4.43-1.82-8.6-6-9.95-10.55C294.2 65.54 277.8 48 256 48s-38.21 17.55-44 37.47c-1.35 4.6-5.52 8.71-9.95 10.53-33.39 13.75-73.87 41.92-73.87 121.35C128.13 304 110 320 84.32 351.43 73.68 364.45 83 384 101.61 384h308.88c18.51 0 27.77-19.61 17.19-32.57zM320 384v16a64 64 0 01-128 0v-16"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
              />
            </svg>
            <div
              class="
                h-2
                w-2
                animate-pulse
                bg-primary
                rounded-full
                absolute
                top-2
                left-4
              "
            ></div>
          </button>
        </div>

        <div
          class="ml-10 w-10 h-10 rounded-full border border-secondary"
        >
          <img
            class="w-full h-full rounded-full"
            :src="user?.avatar || '/img/user.jpeg'"
            alt="avatar"
          />
        </div>
      </div>
    </div>
  </div>
</template>
