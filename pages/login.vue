<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { loginWithEmail } from "~/composables/useAuth";

const email = ref(null);
const password = ref(null);
const hasError = ref(null);
const errorMessage = ref(null);

definePageMeta({
  // middleware: 'guest'
});

const postLoginForm = async function () {
  await loginWithEmail(email.value, password.value);
};
</script>

<template>
<div class="w-full h-screen px-12 flex justify-center bg-gray-200 items-center">
  
  <div class="w-10/12 xl:w-8/12">
    <div class="block bg-white shadow-lg rounded-lg">
      <div class="lg:flex lg:flex-wrap g-0">
        <div class="lg:w-6/12 px-4 md:px-0">
          <div class="md:p-12 md:mx-6">
            <div class="text-center">
              <img
                class="mx-auto w-48"
                src="/img/logo.png"
                alt="logo"
              />
              <h4 class="text-xl font-semibold mt-1 mb-12 pb-1">
                <!-- We are The Lotus Team -->
              </h4>
            </div>
            <form>
              <p class="mb-4">Please login to your account</p>
              <div class="mb-4">
                <input
                  v-model="email"
                  type="email"
                  class="
                    form-control
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700
                    focus:bg-white
                    focus:border-blue-600
                    focus:outline-none
                  "
                  id="exampleFormControlInput1"
                  placeholder="Email address"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="mb-4">
                <input
                  type="password"
                  v-model="password"
                  class="
                    form-control
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700
                    focus:bg-white
                    focus:border-blue-600
                    focus:outline-none
                  "
                  id="exampleFormControlInput1"
                  placeholder="Password"
                  autocomplete="current-password"
                  required
                />
              </div>
              <div class="text-center pt-1 mb-12 pb-1">
                <button
                  @click.prevent="postLoginForm"
                    style="background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);"
                  class="
                    inline-block
                    px-6
                    py-2.5
                    text-white
                    font-medium
                    text-xs
                    leading-tight
                    uppercase
                    rounded
                    shadow-md
                    hover:bg-blue-700 hover:shadow-lg
                    focus:shadow-lg focus:outline-none focus:ring-0
                    active:shadow-lg
                    transition
                    duration-150
                    ease-in-out
                    w-full
                    mb-3
                  "
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  
                >
                  Log in
                </button>
                <a class="text-gray-500" href="#!">Forgot password?</a>
              </div>
            
            </form>
          </div>
        </div>
        <div
        style=" background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);"
          class="
            lg:w-6/12
            flex
            items-center
            lg:rounded-r-lg
            rounded-b-lg
            lg:rounded-bl-none
          "
        >
          <div class="text-white px-4 py-6 md:p-12 md:mx-6">
            <h4 class="text-xl font-semibold mb-6">
              We are more than just a company
            </h4>
            <p class="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
      
</div>
 
</template>