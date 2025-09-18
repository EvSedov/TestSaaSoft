import { localStorageService } from "./localStorageService";
import type { Account } from "../store";

export default {
  ACCOUNT_KEY: "accounts_local_data",

  filterValidAccounts(
    accounts: Account[],
    invalidIndices: number[]
  ): Account[] {
    return accounts.filter((_, index) => !invalidIndices.includes(index));
  },

  saveAccounts(accounts: Account[]): boolean {
    if (accounts.length > 0) {
      localStorageService.setItem(this.ACCOUNT_KEY, accounts);
      return true;
    } else {
      localStorageService.removeItem(this.ACCOUNT_KEY);
      return false;
    }
  },

  loadAccounts(): Account[] | null {
    return localStorageService.getItem(this.ACCOUNT_KEY, null);
  },
};
