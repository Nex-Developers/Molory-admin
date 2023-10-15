<template>
  <!-- <NuxtLayout> -->
  <div class="w-full h-full bg-medium px-10 py-8 overflow-y-auto">
    <!-- page title -->
    <Pagetitle :title="'Transactions/' + transaction?.id" />

    <div class="w-full p-2 flex gap-2 min-h-20 text-sm">
      <div class="max-w-lg md:w-2/5 md:mx-2">
        <!-- Profile Card -->

        <UserInfos :data="user" :id="transaction?.id"></UserInfos>
        <div class="my-4"></div>
      </div>

      <div class="max-w-lg shadow-sm bg-white space-y-4 px-8 py-2">
        <div class="w-full flex flex-col space-y-4">
          <div class="w-full flex border-b border-primary p-1">
            <div class="w-64">
              <h3>Opération</h3>
            </div>
            <div class="w-full">
              <span class="text-red-900" v-if="transaction.type === 'withdraw'"
                >Retrait</span
              >
              <span class="text-green-900" v-if="transaction.type === 'deposit'"
                >Dépot</span
              >

              <span class="text-green-900" v-if="transaction.type === 'recharge'"
                >Recharge</span
              >              <span class="text-blue-700" v-if="transaction.type === 'refund'"
                >Remboursement</span
              >
              <span
                class="text-purple-700"
                v-if="transaction.type === 'payment'"
                >Paiement</span
              >
            </div>
          </div>

          <!--  -->

          <div class="w-full flex border-b border-primary p-1">
            <div class="w-64">
              <h3>Statut</h3>
            </div>
            <div class="w-full">
              <span
                class="p-1 rounded-md text-sm text-white bg-blue-900"
                v-if="transaction?.status === 2"
                >En attente</span
              >
              <span
                class="p-1 rounded-md text-sm text-white bg-green-900"
                v-if="transaction?.status === 1"
                >Effectué</span
              >
              <span
                class="p-1 rounded-md text-sm text-white bg-red-700"
                v-if="transaction?.status === 0"
                >Echoué</span
              >
            </div>
          </div>

          <!--  -->
          <div class="w-full flex border-b border-primary p-1">
            <div class="w-64">
              <h3>Montant</h3>
            </div>
            <div class="w-full">
              <h3 class="text-primary">: {{ transaction?.amount }} FCFA</h3>
            </div>
          </div>

          <!--  -->
          <div class="w-full flex border-b border-primary p-1">
            <div class="w-64">
              <h3>Reference</h3>
            </div>
            <div class="w-full">
              <h3 class="text-primary">: {{ transaction?.ref }}</h3>
            </div>
          </div>

          <!--  -->
          <div class="w-full flex border-b border-primary p-1">
            <div class="w-64">
              <h3>Méthode</h3>
            </div>
            <div class="w-full">
              <h3 class="text-primary">: {{ transaction?.method }}</h3>
            </div>
          </div>

           <!--  -->
           <div class="w-full flex border-b border-primary p-1">
            <div class="w-64">
              <h3>Initialisé le</h3>
            </div>
            <div class="w-full">
              <h3 class="text-primary">: {{ transaction?.createdAt }}</h3>
            </div>
          </div>

            <!--  -->
            <div class="w-full flex border-b border-primary p-1">
            <div class="w-64">
              <h3>Validé le</h3>
            </div>
            <div class="w-full">
              <h3 class="text-primary">: {{ transaction?.validatedAt }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  title: "Transaction Details",
  middleware: "auth",
  layout: "private",
});
const route = useRoute();
const transaction = await getTransaction(route.params.id as string);
console.log(transaction);
const userId: string = transaction?.value?.walletId as string;
const user = await getUser(+userId);
console.log(user);
</script>