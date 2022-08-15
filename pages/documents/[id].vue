<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle :title="'Documents/' + user.lastName + ' ' + user.firstName" />
      <!-- stats card -->
      <div class="w-full mt-6 flex gap-4">
        <div class="w-1/3 bg-white shadow-md p-8">
          <h1>User Infos</h1>
          <UserInfos :data="user" />

          <!--  -->
        </div>
        <div class="w-2/3 bg-white shadow-md p-8">
          <h1>Documents</h1>
          <div class="border mb-8 border-gray-200 rounded-md">
            <DocumentValidationHeader
              :title="idCardTitle"
              :status="user.idCardStatus"
            />
            <div class="w-full flex">
              <div class="w-1/2">
                <Document title="ID Card Front" :path="user.idCardFront" />
              </div>
              <div class="w-1/2">
                <Document title="ID Card Back" :path="user.idCardBack" />
              </div>
            </div>
            <DocumentValidationFooter
              :title="idCardTitle"
              @reject="onReject"
              @validate="onValidate"
            />
          </div>
          <div class="border border-gray-200 rounded-md">
            <DocumentValidationHeader
              :title="driverLicenseTitle"
              :status="user.driverLicenseStatus"
            />

            <div class="w-full flex">
              <div class="w-1/2">
                <Document
                  title="Driver License Front"
                  :path="user.driverLicenseFront"
                />
              </div>
              <div class="w-1/2">
                <Document
                  title="Driver License Back"
                  :path="user.driverLicenseBack"
                />
              </div>
            </div>
            <DocumentValidationFooter
              :title="driverLicenseTitle"
              @reject="onReject"
              @validate="onValidate"
            />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { IUser } from "~~/types/IUser";

definePageMeta({
  title: "Document Details",
  middleware: "auth",
  layout: "private",
});
const route = useRoute();
console.log(route.params.id);
const user: IUser = await getDocument(+route.params.id);
console.log(user);
const idCardTitle = "ID Card";
const driverLicenseTitle = "Driver License";
const onReject = (response, title) => {
  if (title === idCardTitle) validateIdCard(user.id, response);
  else if (title === driverLicenseTitle)
    validateDriverLicense(user.id, response);
  else window.alert("Invalid title");
};

const onValidate = (response, title) => {
  const cardNumber = response;
  if (title === idCardTitle) validateIdCard(user.id, "validate", cardNumber);
  else if (title === driverLicenseTitle)
    validateDriverLicense(user.id, "validate", cardNumber);
  else window.alert("Invalid title");
};
</script>