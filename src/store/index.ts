import { defineStore } from "pinia";

interface Account {
  label: string[];
  tupeRecord: string;
  login: string;
  password: string;
}

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: [] as Account[],
  }),
});
