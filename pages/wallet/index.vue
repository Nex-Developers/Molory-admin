<template>
  <!-- <NuxtLayout> -->
    <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto">
      <!-- page title -->
      <Pagetitle title="Operations" />
      <!-- stats card -->
      <div class="flex flex-wrap">
        <div class="mt-4 w-full lg:w-4/12  px-5 mb-4">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg"
          >
            <div class="flex-auto p-4">
              <div class="flex flex-wrap">
                <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                    Entrées
                  </h5>
                  <span class="font-semibold text-xl text-blueGray-700"
                    >{{ stats?.payin }} FCFA</span
                  >
                </div>
                <div class="relative w-auto pl-4 flex-initial">
                  <div
                    class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-pink-500"
                  >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 fill-current"
                      viewBox="0 0 512 512"
                    >
                      <title>Logo Usd</title>
                      <path
                        d="M240 480v-36.42C160.53 439 112.25 398.06 112 336h72c1.77 26.34 23.86 46.45 56 50v-98l-26.77-7c-61-14.18-93.64-49.39-93.64-102.08C119.59 116.81 164.08 76.08 240 70V32h32v38c77.39 6.3 119 47.74 120 106h-72c-.76-24.06-15.83-43.39-48-46v92l30.82 7.28C367.61 243.46 400 277 400 332c0 64.34-43.74 105.88-128 111.32V480zm0-264v-86c-27.59 1.52-47.27 18.47-47.27 42.53 0 22.3 16.39 36.88 47.27 43.47zm32 78v92c38.15-1.54 56.38-18.92 56.38-45.77 0-24.58-18.23-41.13-56.38-46.23z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <!-- <p class="text-sm text-blueGray-400 mt-4">
                <span class="text-emerald-500 mr-2"
                  ><i class="fas fa-arrow-up"></i> 2,99%
                </span>
                <span class="whitespace-nowrap"> Since last month </span>
              </p> -->
            </div>
          </div>
        </div>

        <div class="mt-4 w-full lg:w-4/12 px-5">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white rounded mb-4 xl:mb-0 shadow-lg"
          >
            <div class="flex-auto p-4">
              <div class="flex flex-wrap">
                <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                    Sorties
                  </h5>
                  <span class="font-semibold text-xl text-blueGray-700"
                    >{{ stats?.payout }} FCFA</span
                  >
                </div>
                <div class="relative w-auto pl-4 flex-initial">
                  <div
                    class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-primary"
                  >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 fill-current"
                      viewBox="0 0 512 512"
                    >
                      <title>Logo Usd</title>
                      <path
                        d="M240 480v-36.42C160.53 439 112.25 398.06 112 336h72c1.77 26.34 23.86 46.45 56 50v-98l-26.77-7c-61-14.18-93.64-49.39-93.64-102.08C119.59 116.81 164.08 76.08 240 70V32h32v38c77.39 6.3 119 47.74 120 106h-72c-.76-24.06-15.83-43.39-48-46v92l30.82 7.28C367.61 243.46 400 277 400 332c0 64.34-43.74 105.88-128 111.32V480zm0-264v-86c-27.59 1.52-47.27 18.47-47.27 42.53 0 22.3 16.39 36.88 47.27 43.47zm32 78v92c38.15-1.54 56.38-18.92 56.38-45.77 0-24.58-18.23-41.13-56.38-46.23z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <!-- <p class="text-sm text-blueGray-400 mt-4">
                <span class="text-red-500 mr-2"
                  ><i class="fas fa-arrow-down"></i> 4,01%</span
                >
                <span class="whitespace-nowrap"> Since last week </span>
              </p> -->
            </div>
          </div>
        </div>

        <div class="mt-4 w-full lg:w-4/12 px-5">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
          >
            <div class="flex-auto p-4">
              <div class="flex flex-wrap">
                <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                    Revenus
                  </h5>
                  <span class="font-semibold text-xl text-blueGray-700"
                    >{{ (stats?.payin - stats?.payout) || 0 }} FCFA
                  </span>
                </div>
                <div class="relative w-auto pl-4 flex-initial">
                  <div
                    class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-emerald-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 fill-current"
                      viewBox="0 0 512 512"
                    >
                      <title>Logo Usd</title>
                      <path
                        d="M240 480v-36.42C160.53 439 112.25 398.06 112 336h72c1.77 26.34 23.86 46.45 56 50v-98l-26.77-7c-61-14.18-93.64-49.39-93.64-102.08C119.59 116.81 164.08 76.08 240 70V32h32v38c77.39 6.3 119 47.74 120 106h-72c-.76-24.06-15.83-43.39-48-46v92l30.82 7.28C367.61 243.46 400 277 400 332c0 64.34-43.74 105.88-128 111.32V480zm0-264v-86c-27.59 1.52-47.27 18.47-47.27 42.53 0 22.3 16.39 36.88 47.27 43.47zm32 78v92c38.15-1.54 56.38-18.92 56.38-45.77 0-24.58-18.23-41.13-56.38-46.23z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <!-- <p class="text-sm text-blueGray-400 mt-4">
                <span class="text-emerald-500 mr-2"
                  ><i class="fas fa-arrow-up"></i> 12%
                </span>
                <span class="whitespace-nowrap"> Since last mounth </span>
              </p> -->
            </div>
          </div>
        </div>
      </div>
      <div class="w-full mt-6 ">
        <!-- <div class="bg-white shadow-sm">
          <Table
            title="Payments"
            :headers="paymentsTableHeaders"
            :data="payments"
            :details="paymentDetails"
          />
        </div> -->
        <div class="space-y-4">
          <!-- <Table
            title="Transactions"
            :headers="withdrawalTableHeaders"
            :data="transactions"
            :details="withdrawalDetails"
          /> -->
            <div class="bg-white shadow-sm flex justify-between p-2 rounded-md" v-for="transaction in transactions" :key="transaction.id" @click="details(transaction.id)" >
              <div class="" >
                <small>{{ transaction.createdAt }}</small>
                <h3 class="text-sm w-96">
                  <span class="text-red-900" v-if="transaction.type==='withdraw'">Retrait</span>
                  <span class="text-green-900" v-if="transaction.type==='deposit'">Dépot</span>
                  <span class="text-green-900" v-if="transaction.type==='recharge'">Dépot</span>
                   <span class="text-blue-700" v-if="transaction.type==='refund'">Remboursement</span>
                   <span class="text-purple-700" v-if="transaction.type==='payment'">Paiement</span>

                  {{ transaction.ref }}</h3>
             
              </div>

              <div class="w-32 text-left">
                <h3>{{  transaction.amount }}</h3>
                <small>{{ transaction.method }}</small>
              </div>

              <div >
                <div>
                  <!-- <span class="text-blue-900" v-if="transaction.status===3">En attente</span> -->
                  <span class="p-1 rounded-md text-sm  text-white bg-blue-900" v-if="transaction.status===2">En attente</span>
                  <span class="p-1 rounded-md text-sm  text-white bg-green-900" v-if="transaction.status===1">Effectué</span>
                   <span class="p-1 rounded-md text-sm  text-white bg-red-700" v-if="transaction.status===0">Echoué</span>
                </div>
               
              </div>
            </div>

        </div>
      </div>
    </div>
  <!-- </NuxtLayout> -->
</template>
<script lang="ts" setup>
import { IPayment, ITransaction } from "~~/types";

definePageMeta({
  title: "Utilisateurs",
  middleware: "auth",
  layout: "private",
});

getTransactions();
getStats();

// getWithdrawals();
// getPayments();
const details = (id) => {
  const router = useRouter();
  router.push("/wallet/" + id);
};
  const searchValue = useState<any>("searchValue");
const transactions = computed<any[]>(() => {
  const data = useState<ITransaction[]>("transactions");
  // console.log('travel', data.value)
  if (!data.value) return [];
  if (!data.value.length) return [];
  if (!searchValue.value) return data.value;
  const computedData = data.value.filter(
    item => item?.ref?.toLowerCase().includes(searchValue.value?.toLowerCase())
  || item?.type?.toLowerCase().includes(searchValue.value?.toLowerCase())
  );
  // console.log('computed', computedData)
  return computedData;
});
const stats = useState<any>("stats");
const paymentsTableHeaders = [
  { label: "Avatar", field: "avatar", type: "image" },
  { label: "Type", field: "type" },
  { label: "Numero", field: "phoneNumber" },
  { label: "Montant", field: "amount" },
  { label: "Statut", field: "status" },
];
const withdrawalTableHeaders = [
  { label: "Avatar", field: "avatar", type: "image" },
  { label: "Nom", field: "lastName" },
  { label: "Numero", field: "phone" },
  { label: "Montant", field: "amount" },
  { label: "Statut", field: "status" },
];

const paymentDetails = (id) => {
  // const router = useRouter();
  // router.push("/payment-" + id);
};

const withdrawalDetails = (id) => {
  // const router = useRouter();
  // router.push("/withdrawal-" + id);
};

//getPayments()
//getWithdrawals()
</script>
