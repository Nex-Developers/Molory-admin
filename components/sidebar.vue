<script lang="ts" setup>
const isSettingPath = () => {};

let displayMenu = ref(false);
let settingMenu = ref(false);

const setMenu = () => {
  displayMenu.value = !displayMenu.value;
};

const logout = () => userLogout();
onMounted(() => {
  const route = useRoute();
  settingMenu.value = route.fullPath.includes("/settings");
});
</script>


<template>
  <div
    class="
      flex flex-col
      justify-between
      items-center
      flex-none
      w-20
      h-full
      border-r border-gray-200
    "
  >
    <div class="flex flex-col space-y-4 w-full items-center pt-5">
      <NuxtLink to="/" class="text-gray-600" activeClass="active-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 fill-current"
          viewBox="0 0 512 512"
        >
          <title>Dashboard</title>
          <path
            d="M204 240H68a36 36 0 01-36-36V68a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zM444 240H308a36 36 0 01-36-36V68a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zM204 480H68a36 36 0 01-36-36V308a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zM444 480H308a36 36 0 01-36-36V308a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36z"
          />
        </svg>
      </NuxtLink>

      <NuxtLink to="/users" class="text-gray-600" activeClass="active-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 fill-current"
          viewBox="0 0 512 512"
        >
          <title>Utilisateurs</title>
          <path
            d="M336 256c-20.56 0-40.44-9.18-56-25.84-15.13-16.25-24.37-37.92-26-61-1.74-24.62 5.77-47.26 21.14-63.76S312 80 336 80c23.83 0 45.38 9.06 60.7 25.52 15.47 16.62 23 39.22 21.26 63.63-1.67 23.11-10.9 44.77-26 61C376.44 246.82 356.57 256 336 256zm66-88zM467.83 432H204.18a27.71 27.71 0 01-22-10.67 30.22 30.22 0 01-5.26-25.79c8.42-33.81 29.28-61.85 60.32-81.08C264.79 297.4 299.86 288 336 288c36.85 0 71 9 98.71 26.05 31.11 19.13 52 47.33 60.38 81.55a30.27 30.27 0 01-5.32 25.78A27.68 27.68 0 01467.83 432zM147 260c-35.19 0-66.13-32.72-69-72.93-1.42-20.6 5-39.65 18-53.62 12.86-13.83 31-21.45 51-21.45s38 7.66 50.93 21.57c13.1 14.08 19.5 33.09 18 53.52-2.87 40.2-33.8 72.91-68.93 72.91zM212.66 291.45c-17.59-8.6-40.42-12.9-65.65-12.9-29.46 0-58.07 7.68-80.57 21.62-25.51 15.83-42.67 38.88-49.6 66.71a27.39 27.39 0 004.79 23.36A25.32 25.32 0 0041.72 400h111a8 8 0 007.87-6.57c.11-.63.25-1.26.41-1.88 8.48-34.06 28.35-62.84 57.71-83.82a8 8 0 00-.63-13.39c-1.57-.92-3.37-1.89-5.42-2.89z"
          />
        </svg>
      </NuxtLink>

      <NuxtLink to="/documents" class="text-gray-600" activeClass="active-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 fill-current"
          viewBox="0 0 512 512"
        >
          <title>Documents</title>
          <path
            d="M298.39 248a4 4 0 002.86-6.8l-78.4-79.72a4 4 0 00-6.85 2.81V236a12 12 0 0012 12z"
          />
          <path
            d="M197 267a43.67 43.67 0 01-13-31v-92h-72a64.19 64.19 0 00-64 64v224a64 64 0 0064 64h144a64 64 0 0064-64V280h-92a43.61 43.61 0 01-31-13zM372 120h70.39a4 4 0 002.86-6.8l-78.4-79.72a4 4 0 00-6.85 2.81V108a12 12 0 0012 12z"
          />
          <path
            d="M372 152a44.34 44.34 0 01-44-44V16H220a60.07 60.07 0 00-60 60v36h42.12A40.81 40.81 0 01231 124.14l109.16 111a41.11 41.11 0 0111.83 29V400h53.05c32.51 0 58.95-26.92 58.95-60V152z"
          />
        </svg>
      </NuxtLink>

      <NuxtLink to="/trips" class="text-gray-600" activeClass="active-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 fill-current"
          viewBox="0 0 512 512"
        >
          <title>Trajet</title>
          <path
            d="M328.85 156.79a26.69 26.69 0 1018.88 7.81 26.6 26.6 0 00-18.88-7.81z"
          />
          <path
            d="M477.44 50.06a.29.29 0 010-.09 20.4 20.4 0 00-15.13-15.3c-29.8-7.27-76.68.48-128.63 21.28-52.36 21-101.42 52-134.58 85.22A320.7 320.7 0 00169.55 175c-22.33-1-42 2.18-58.57 9.41-57.74 25.41-74.23 90.44-78.62 117.14a25 25 0 0027.19 29h.13l64.32-7.02c.08.82.17 1.57.24 2.26a34.36 34.36 0 009.9 20.72l31.39 31.41a34.27 34.27 0 0020.71 9.91l2.15.23-7 64.24v.13A25 25 0 00206 480a25.25 25.25 0 004.15-.34C237 475.34 302 459.05 327.34 401c7.17-16.46 10.34-36.05 9.45-58.34a314.78 314.78 0 0033.95-29.55c33.43-33.26 64.53-81.92 85.31-133.52 20.69-51.36 28.48-98.59 21.39-129.53zM370.38 224.94a58.77 58.77 0 110-83.07 58.3 58.3 0 010 83.07z"
          />
          <path
            d="M161.93 386.44a16 16 0 00-11 2.67c-6.39 4.37-12.81 8.69-19.29 12.9-13.11 8.52-28.79-6.44-21-20l12.15-21a16 16 0 00-15.16-24.91A61.25 61.25 0 0072 353.56c-3.66 3.67-14.79 14.81-20.78 57.26A357.94 357.94 0 0048 447.59 16 16 0 0064 464h.4a359.87 359.87 0 0036.8-3.2c42.47-6 53.61-17.14 57.27-20.8a60.49 60.49 0 0017.39-35.74 16 16 0 00-13.93-17.82z"
          />
        </svg>
      </NuxtLink>
      <NuxtLink to="/wallet" class="text-gray-600" activeClass="active-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 fill-current"
          viewBox="0 0 512 512"
        >
          <title>Wallet</title>
          <path
            d="M95.5 104h320a87.73 87.73 0 0111.18.71 66 66 0 00-77.51-55.56L86 94.08h-.3a66 66 0 00-41.07 26.13A87.57 87.57 0 0195.5 104zM415.5 128h-320a64.07 64.07 0 00-64 64v192a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V192a64.07 64.07 0 00-64-64zM368 320a32 32 0 1132-32 32 32 0 01-32 32z"
          />
          <path
            d="M32 259.5V160c0-21.67 12-58 53.65-65.87C121 87.5 156 87.5 156 87.5s23 16 4 16-18.5 24.5 0 24.5 0 23.5 0 23.5L85.5 236z"
          />
        </svg>
      </NuxtLink>
       
      <div class="relative">
        <button
          @click="setMenu()"
          :class="[settingMenu ? 'text-primary animate-spin' : 'text-gray-600']"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 fill-current"
            viewBox="0 0 512 512"
          >
            <title>Settings</title>
            <circle cx="256" cy="256" r="48" />
            <path
              d="M470.39 300l-.47-.38-31.56-24.75a16.11 16.11 0 01-6.1-13.33v-11.56a16 16 0 016.11-13.22L469.92 212l.47-.38a26.68 26.68 0 005.9-34.06l-42.71-73.9a1.59 1.59 0 01-.13-.22A26.86 26.86 0 00401 92.14l-.35.13-37.1 14.93a15.94 15.94 0 01-14.47-1.29q-4.92-3.1-10-5.86a15.94 15.94 0 01-8.19-11.82l-5.59-39.59-.12-.72A27.22 27.22 0 00298.76 26h-85.52a26.92 26.92 0 00-26.45 22.39l-.09.56-5.57 39.67a16 16 0 01-8.13 11.82 175.21 175.21 0 00-10 5.82 15.92 15.92 0 01-14.43 1.27l-37.13-15-.35-.14a26.87 26.87 0 00-32.48 11.34l-.13.22-42.77 73.95a26.71 26.71 0 005.9 34.1l.47.38 31.56 24.75a16.11 16.11 0 016.1 13.33v11.56a16 16 0 01-6.11 13.22L42.08 300l-.47.38a26.68 26.68 0 00-5.9 34.06l42.71 73.9a1.59 1.59 0 01.13.22 26.86 26.86 0 0032.45 11.3l.35-.13 37.07-14.93a15.94 15.94 0 0114.47 1.29q4.92 3.11 10 5.86a15.94 15.94 0 018.19 11.82l5.56 39.59.12.72A27.22 27.22 0 00213.24 486h85.52a26.92 26.92 0 0026.45-22.39l.09-.56 5.57-39.67a16 16 0 018.18-11.82c3.42-1.84 6.76-3.79 10-5.82a15.92 15.92 0 0114.43-1.27l37.13 14.95.35.14a26.85 26.85 0 0032.48-11.34 2.53 2.53 0 01.13-.22l42.71-73.89a26.7 26.7 0 00-5.89-34.11zm-134.48-40.24a80 80 0 11-83.66-83.67 80.21 80.21 0 0183.66 83.67z"
            />
          </svg>
        </button>
        <div class="absolute w-30 z-50 shadow-lg px-2 bg-white" v-if="displayMenu">
          <NuxtLink to="/settings/preferences"
            ><div class="p-1">Preferences</div></NuxtLink
          >
          <NuxtLink to="/settings/vehicle-types"
            ><div class="p-1">Vehicles</div></NuxtLink
          >
          <!-- <NuxtLink to="/settings/pricings"
            ><div class="p-1">Pricings</div></NuxtLink
          > -->
        </div>
      </div>
      
    </div>
    <div class="flex flex-col space-y-4 w-full items-center pb-5">
      <NuxtLink to="/" class="block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 fill-current text-gray-600"
          viewBox="0 0 512 512"
        >
          <title>Information Circle</title>
          <path
            d="M256 56C145.72 56 56 145.72 56 256s89.72 200 200 200 200-89.72 200-200S366.28 56 256 56zm0 82a26 26 0 11-26 26 26 26 0 0126-26zm48 226h-88a16 16 0 010-32h28v-88h-16a16 16 0 010-32h32a16 16 0 0116 16v104h28a16 16 0 010 32z"
          />
        </svg>
      </NuxtLink>
      <a @click="logout" class="block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 fill-current text-gray-600"
          viewBox="0 0 512 512"
        >
          <title>Log Out</title>
          <path
            d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40M368 336l80-80-80-80M176 256h256"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.active-link {
  color: #ff1e00 !important;
}
</style>
