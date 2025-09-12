import { defineStore } from "pinia";

interface Account {
  label: [] | { text: string }[];
  typeRecord: { name: "LDAP" | "Локальная"; type: "local" | "ldap" } | string;
  login: string;
  password: null | string;
}

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount(account: Account) {
      this.accounts.push(account);
    },
    removeAccount(index: number) {
      if (index >= 0 && index < this.accounts.length) {
        this.accounts.splice(index, 1);
      }
    },
  },
});
