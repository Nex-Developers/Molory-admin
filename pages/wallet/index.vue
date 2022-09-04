<template>
  <NuxtLayout>
    <div class="w-full h-full bg-medium px-10 py-8">
      <!-- page title -->
      <Pagetitle title="Operations" />
      <!-- stats card -->
      <div class="grid grid-cols-3  mt-6">
        <div class="w-full flex justify-center">
            <div class="w-80 h-40 bg-white shadow-md">
                <h3>Entrance</h3>
            </div>
        </div>
        <div class="w-full flex justify-center">
            <div class="w-80 h-40 bg-white shadow-md">
                <h3>Ouput</h3>
            </div>
        </div>
       <div class="w-full flex justify-center">
            <div class="w-80 h-40 bg-white shadow-md">
                <h3>Income</h3>
            </div>
        </div>
      </div>
      <div class="w-full mt-6 grid grid-cols-2 gap-8">
        <div class="bg-white shadow-sm">
          <Table
            title="Payments"
            :headers="paymentsTableHeaders"
            :data="payments"
            :details="paymentDetails"
          />
        </div>
        <div class="bg-white shadow-sm">
          <Table
          title="Withdrawals"
            :headers="withdrawalTableHeaders"
            :data="withdrawals"
            :details="withdrawalDetails"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { IUser } from "~~/types/IUser";

definePageMeta({
  title: "Utilisateurs",
  middleware: "auth",
  layout: "private",
});

const payments = useState<IUser[]>("payments");
const withdrawals = useState<IUser[]>("withdrawals");

const paymentsTableHeaders = [
  { label: "Avatar", field: "avatar", type: "image" },
  { label: "First Name", field: "firstName" },
  { label: "Last Name", field: "lastName" },
  { label: "Phone Number", field: "phoneNumber" },
  { label: "Role", field: "role" },
];
const withdrawalTableHeaders = [
  { label: "Avatar", field: "avatar", type: "image" },
  { label: "First Name", field: "firstName" },
  { label: "Last Name", field: "lastName" },
  { label: "Phone Number", field: "phoneNumber" },
  { label: "Role", field: "role" },
];

const paymentDetails = (id) => {
  const router = useRouter();
  router.push("/payment-" + id);
};

const withdrawalDetails = (id) => {
  const router = useRouter();
  router.push("/withdrawal-" + id);
};

//getPayments()
//getWithdrawals()
</script>
