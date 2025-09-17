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
import {
  ref,
  watch,
  type MaybeRefOrGetter,
  toValue,
  onMounted,
  onUnmounted,
} from "vue";
import useValidation from "../useValidation";
import { debounce } from "lodash-es";
import { useToast } from "primevue/usetoast";
import { localStorageService } from "../services/localStorageService";
import { TableSchema } from "../schemas/accountSchema";
import formattingService from "../services/formattingService";

const typeRecords = [
  { name: "LDAP", type: "ldap" },
  { name: "Локальная", type: "local" },
];
const toast = useToast();
const ACCOUNT_KEY = "accounts_local_data";
const succeeded = ref<boolean>(false);

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);

const { validate, getError, clearErrors } = useValidation(
  TableSchema,
  accounts,
  {
    mode: "lazy",
  }
);
const { parseLabels, formatLabels } = formattingService;

const addAccount = async () => {
  accountsStore.addAccount({
    label: [],
    typeRecord: "",
    login: "",
    password: "",
  });

  toast.add({
    severity: "success",
    summary: "Новая запись",
    detail: "Добавлена новая пустая запись",
    life: 3000,
  });
};

const removeAccount = (index: number) => {
  accountsStore.removeAccount(index);
  saveData(accounts);
  toast.add({
    severity: "success",
    summary: "Данные сохранены",
    detail: "Запись успешно удалена",
    life: 3000,
  });
};

const onBlure = async () => {
  const errors = await validate();
  if (saveData(accounts, errors) && !succeeded.value) {
    toast.add({
      severity: "success",
      summary: "Данные сохранены",
      detail: "Все валидные данные сохранены",
      life: 3000,
    });
    succeeded.value = true;
  }
};

const saveData = debounce(
  (
    data: MaybeRefOrGetter,
    errors: MaybeRefOrGetter<
      Record<number, Record<string, string>>
    > | null = null
  ) => {
    const errorsKeys = Object.keys(toValue(errors) || {});
    const validData = toValue(data).filter(
      (_: any, index: number) => !errorsKeys.includes(index.toString())
    );

    if (validData) {
      localStorageService.setItem(ACCOUNT_KEY, validData);
      return true;
    } else {
      localStorageService.removeItem(ACCOUNT_KEY);
    }

    return false;
  },
  300
);

watch(
  () => accounts.value.length,
  () => clearErrors()
);

onMounted(() => {
  try {
    const data = localStorageService.getItem(ACCOUNT_KEY, null);
    if (data) {
      accounts.value = data;
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    toast.add({
      severity: "error",
      summary: "Ошибка загрузки",
      detail: "Не удалось загрузить данные учетных записей",
      life: 3000,
    });
  }
});

onUnmounted(() => {
  saveData(accounts);
});
</script>

<template>
  <div class="card">
    <DataTable
      :value="accounts"
      :resizableColumns="true"
      columnResizeMode="fit"
      tableStyle="min-width: 50rem"
      :rowClass="() => 'h-22'"
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
            Для указания нескольких меток для одной пары логин/пароль
            используйте разделитель <span class="font-extrabold">;</span>
          </span>
        </Message>
      </template>

      <template #empty>Данные отсутствуют</template>

      <Column field="label" header="Метки" style="width: 24%" class="my-4">
        <template #body="{ data, field, index }">
          <InputText
            :id="`label-${index}`"
            v-if="field && typeof field === 'string'"
            type="text"
            :value="formattingService.formatLabels(data[field])"
            :class="{ 'p-invalid': !!getError('label', index) }"
            @blur="onBlure"
            @update:modelValue="
              (val: string | undefined) => {
                formattingService.parseLabels(val)
                succeeded = false;
              }
            "
            autofocus="true"
            maxlength="50"
          />
          <div class="error">{{ getError("label", index) }}</div>
        </template>
      </Column>
      <Column field="typeRecord" header="Тип записи" style="width: 24%">
        <template #body="{ data, field, index }">
          <div class="relative">
            <Select
              v-if="field && typeof field === 'string'"
              :options="typeRecords"
              :class="{ 'p-invalid': !!getError('typeRecord', index) }"
              optionLabel="name"
              v-model="data[field]"
              placeholder="Тип записи"
              @value-change="
                () => {
                  onBlure();
                  if (data[field]?.type === 'ldap') {
                    data.password = null;
                  } else {
                    if (!data.password) {
                      data.password = '';
                    }
                  }

                  succeeded = false;
                }
              "
            />
            <div class="error absolute top-10 left-0">
              {{ getError("typeRecord", index) }}
            </div>
          </div>
        </template></Column
      >
      <Column field="login" header="Логин" style="width: 24%">
        <template #body="{ data, field, index }">
          <div class="relative">
            <InputText
              :id="`login-${index}`"
              v-if="field && typeof field === 'string'"
              type="text"
              v-model="data[field]"
              required
              :class="{ 'p-invalid': !!getError('login', index) }"
              @blur="onBlure"
              @update:modelValue="succeeded = false"
              maxlength="100"
            />
            <div class="error absolute top-10 left-0">
              {{ getError("login", index) }}
            </div>
          </div>
        </template></Column
      >
      <Column field="password" header="Пароль" style="width: 24%">
        <template #body="{ data, field, index }">
          <div
            v-if="
              field &&
              typeof field === 'string' &&
              data.typeRecord?.type !== 'ldap'
            "
            class="relative"
          >
            <Password
              :id="`password-${index}`"
              type="text"
              v-model="data[field]"
              variant="filled"
              :feedback="false"
              toggleMask
              required
              maxlength="100"
              minlength="8"
              :class="{ 'p-invalid': !!getError('password', index) }"
              @blur="onBlure"
              @update:modelValue="succeeded = false"
            />
            <div class="error absolute top-10 left-0">
              {{ getError("password", index) }}
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 4%">
        <template #body="{ index }">
          <Button
            icon="pi pi-trash"
            severity="danger"
            aria-label="Delete"
            @click="removeAccount(index)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.error {
  font-size: 12px;
  color: red;
  margin-top: 4px;
}
</style>
