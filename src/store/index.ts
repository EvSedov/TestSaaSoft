import { defineStore } from "pinia";

interface Account {
  label: [] | string[];
  typeRecord: { name: string; type: string } | string;
  login: string;
  password: string;
}

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount(account: Account) {
      this.accounts.push(account);
    },
  },
});
