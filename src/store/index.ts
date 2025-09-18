import { defineStore } from "pinia";

export type RecordType = {
  name: string;
  type: string;
  requiresPassword: boolean;
};
export interface Account {
  label: { text: string }[];
  typeRecord: RecordType;
  login: string;
  password: null | string;
}

export const useAccountsStore = defineStore("accountsStore", {
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
