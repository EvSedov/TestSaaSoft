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
  shallowRef,
  type MaybeRefOrGetter,
  toValue,
  onMounted,
  onUnmounted,
} from "vue";
import { z } from "zod";
import useValidation from "../useValidation";
import { debounce } from "lodash-es";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const ACCOUNT_KEY = "accounts_local_data";
const succeeded = ref<boolean>(false);
const typeRecords = ref([
  { name: "LDAP", type: "ldap" },
  { name: "Локальная", type: "local" },
]);
const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);
const RowSchema = z.object({
  label: z.nullable(
    z
      .array(
        z.object({
          text: z.string().nonempty("Метка не может быть пустой"),
        })
      )
      .optional()
  ),
  typeRecord: z.object(
    {
      name: z.literal(["LDAP", "Локальная"]),
      type: z.literal(["ldap", "local"]),
    },
    "Выберите одно из значений"
  ),
  login: z
    .string()
    .nonempty("Логин не может быть пустым")
    .max(100, "Логин не может быть больше 100 символов"),
  password: z.nullable(
    z
      .string()
      .min(8, "Пароль не может быть меньше 8 символов")
      .max(100, "Пароль не может быть больше 100 символов")
      .optional()
  ),
});
export type RowType = z.infer<typeof RowSchema>;
const TableSchema = shallowRef<any>(z.array(RowSchema));
const { validate, isValid, getError, clearErrors } = useValidation(
  TableSchema,
  accounts,
  {
    mode: "lazy",
  }
);

const addAccount = () => {
  accountsStore.addAccount({
    label: [],
    typeRecord: "",
    login: "",
    password: "",
  });
  saveData(accounts);
  toast.add({
    severity: "success",
    summary: "Данные сохранены",
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
  await validate();

  if (isValid.value && !succeeded.value) {
    saveData(accounts);
    toast.add({
      severity: "success",
      summary: "Данные сохранены",
      detail: "Все записи провалидированы и обновлены",
      life: 3000,
    });
    succeeded.value = true;
  }
};

const saveData = debounce((data: MaybeRefOrGetter) => {
  const text = JSON.stringify(toValue(data));
  if (text.trim()) {
    localStorage.setItem(ACCOUNT_KEY, text);
  } else {
    localStorage.removeItem(ACCOUNT_KEY);
  }
}, 300);

watch(
  () => accounts.value,
  () => {
    if (accounts.value.length === 0) {
      clearErrors();
    }
    console.log(accounts.value);
  },
  { deep: true }
);

onMounted(() => {
  try {
    const data = localStorage.getItem(ACCOUNT_KEY);
    if (data) {
      accounts.value = JSON.parse(data);
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
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
            :value="
              Array.isArray(data[field])
                ? data[field].map((item) => item.text).join('; ')
                : data[field] || ''
            "
            :class="{ 'p-invalid': !!getError('label', index) }"
            @blur="onBlure"
            @update:modelValue="
              (val) => {
                console.log({ val });
                if (Array.isArray(data[field])) {
                  data[field] = val
                    ?.split(';')
                    .map((s) => s.trim())
                    // .filter((s) => s)
                    .map((s) => ({ text: s }));
                }

                if (!val) {
                  data[field] = [];
                }
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
