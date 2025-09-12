<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useAccountsStore } from "../store";
import { storeToRefs } from "pinia";

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);
</script>

<template>
  <DataTable :value="accounts" tableStyle="min-width: 50rem">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl font-bold">Учетные записи</span>
        <Button icon="pi pi-refresh" rounded raised />
      </div>
    </template>
    <Column field="label" header="Метки"></Column>
    <Column field="typeRecord" header="Тип записи"></Column>
    <Column field="login" header="Логин"></Column>
    <Column field="password" header="Пароль"></Column>
  </DataTable>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
