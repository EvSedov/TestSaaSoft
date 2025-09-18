import { ref } from "vue";
import { useAccountsStore, type RecordType } from "../store";
// import { accountService } from "../services/accountService";
import { useToast } from "primevue/usetoast";
// import { storeToRefs } from "pinia";

export function useAccounts() {
  const store = useAccountsStore();
  const toast = useToast();
  const succeeded = ref(false);

  // Методы работы с учетными записями
  const addAccount = () => {
    store.addAccount({
      label: [],
      typeRecord: {} as RecordType,
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
    store.removeAccount(index);

    toast.add({
      severity: "success",
      summary: "Данные сохранены",
      detail: "Запись успешно удалена",
      life: 3000,
    });
  };

  // const saveValidAccounts = (invalidIndices: number[]) => {
  //   // Логика сохранения только валидных записей
  // };

  return {
    accounts: store.accounts,
    succeeded,
    addAccount,
    removeAccount,
    // saveValidAccounts,
  };
}
