<script lang="ts" setup>
import { IUser } from "~~/types/IUser";

definePageMeta({
  title: "Document Details",
  middleware: "auth",
  layout: "private",
});
const route = useRoute();
const router = useRouter();
const id = +route.params.id;
const user = ref<IUser>(null);
user.value = await getDocument(id);
console.log(user);
const idCardTitle = "ID Card";
const driverLicenseTitle = "Driver License";
const isLoadingValidate = ref(false);
const isLoadingReject = ref(false);

const onReject = (response, title) => {
  isLoadingReject.value = true;
  if (title === idCardTitle) validateIdCard(user.value.id, response);
  else if (title === driverLicenseTitle)
    validateDriverLicense(user.value.id, response);
  else window.alert("Invalid title");
  isLoadingReject.value = false;
  router.push("/documents");
};

const onValidate = (response, title) => {
  isLoadingValidate.value = true
  const cardNumber = response;
  if (title === idCardTitle)
    validateIdCard(user.value.id, "validate", cardNumber);
  else if (title === driverLicenseTitle)
    validateDriverLicense(user.value.id, "validate", cardNumber);
  else window.alert("Invalid title");
  isLoadingValidate.value = false;
  router.push("/documents");
};

const isLoadingData = useState<boolean>('showLoader');

</script>

<template>
  <!-- <NuxtLayout> -->
    <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto relative">
      <!-- page title -->
      <Pagetitle :title="'Documents/' + user.lastName + ' ' + user.firstName" />
      <!-- stats card -->
      <!-- stats card -->
      <div class="w-full mt-6">
        <div class="md:flex no-wrap md:-mx-2">
          <!-- Left Side -->
          <div class="w-full md:w-3/12 md:mx-2">
            <!-- Profile Card -->

            <UserInfosPanel :data="user" :id="id" />
            <div class="my-4"></div>
          </div>
          <!-- Right Side -->
          <div class="w-full space-y-4 md:w-9/12 mx-2 h-64">
            <div class="bg-white p-3 shadow-sm rounded-sm">
              <div class="border mb-8 border-gray-200 rounded-md">
                <DocumentCardHeader
                  :title="idCardTitle"
                  :status="user.idCardStatus"
                />
                <div class="w-full flex">
                  <div class="w-1/2">
                    <DocumentItem
                      title="ID Card Front"
                      :path="user.idCardFront"
                    />
                  </div>
                  <div class="w-1/2">
                    <DocumentItem
                      title="ID Card Back"
                      :path="user.idCardBack"
                    />
                  </div>
                </div>
                <DocumentCardFooter
                  :title="idCardTitle"
                  @reject="onReject"
                  @validate="onValidate"
                />
              </div>
            </div>
            <div class="bg-white p-3 shadow-sm rounded-sm">
              <div class="border border-gray-200 rounded-md">
                <DocumentCardHeader
                  :title="driverLicenseTitle"
                  :status="user.driverLicenseStatus"
                />

                <div class="w-full flex">
                  <div class="w-1/2">
                    <DocumentItem
                      title="Driver License Front"
                      :path="user.driverLicenseFront"
                    />
                  </div>
                  <div class="w-1/2">
                    <DocumentItem
                      title="Driver License Back"
                      :path="user.driverLicenseBack"
                    />
                  </div>
                </div>
                <DocumentCardFooter
                  :title="driverLicenseTitle"
                  :isLoadingValidate="isLoadingValidate"
                  :isLoadingReject="isLoadingReject"
                  @reject="onReject"
                  @validate="onValidate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertsLoader v-if="isLoadingData" />
    </div>
  <!-- </NuxtLayout> -->
</template>
