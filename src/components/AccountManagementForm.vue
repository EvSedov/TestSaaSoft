<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Message from "primevue/message";
import { useAccountsStore } from "../store";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);
const typeRecords = ref([
  { name: "LDAP", type: "ldap" },
  { name: "Локальная", type: "local" },
]);

const addAccount = () => {
  accountsStore.addAccount({
    label: [],
    typeRecord: "",
    login: "",
    password: "",
  });
};

watch(
  () => accounts.value,
  () => console.log(accounts.value),
  { deep: true }
);
</script>

<template>
  <DataTable
    :value="accounts"
    resizableColumns
    columnResizeMode="fit"
    tableStyle="min-width: 40rem"
  >
    <template #header>
      <div class="flex flex-wrap items-center gap-3 mb-3">
        <span class="text-xl font-bold">Учетные записи</span>
        <Button
          icon="pi pi-plus"
          severity="info"
          variant="outlined"
          @click="addAccount"
        />
      </div>
      <Message severity="info" icon="pi pi-question">
        <template #icon>
          <div
            class="w-10 h-10 rounded-full outline-1 flex justify-center items-center"
          >
            <i class="pi pi-question" style="color: slateblue"></i>
          </div>
        </template>
        <span>
          Для указания нескольких меток для одной пары логин/пароль используйте
          разделитель <span class="font-extrabold">;</span>
        </span>
      </Message>
    </template>

    <template #empty>Данные отсутствуют</template>

    <Column field="label" header="Метки">
      <template #body="{ data, field }">
        <InputText
          v-if="field && typeof field === 'string'"
          type="text"
          v-model="data[field]"
        />
      </template>
    </Column>
    <Column field="typeRecord" header="Тип записи">
      <template #body="{ data, field }">
        <Select
          v-if="field && typeof field === 'string'"
          :options="typeRecords"
          optionLabel="name"
          v-model="data[field]"
          placeholder="Тип записи"
        /> </template
    ></Column>
    <Column field="login" header="Логин">
      <template #body="{ data, field }">
        <InputText
          v-if="field && typeof field === 'string'"
          type="text"
          v-model="data[field]"
        /> </template
    ></Column>
    <Column field="password" header="Пароль">
      <template #body="{ data, field }">
        <Password
          v-if="
            field &&
            typeof field === 'string' &&
            data['typeRecord'].type === 'local'
          "
          type="text"
          v-model="data[field]"
        />
      </template>
    </Column>
    <Column>
      <template #body>
        <Button icon="pi pi-trash" severity="danger" aria-label="Delete" />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
