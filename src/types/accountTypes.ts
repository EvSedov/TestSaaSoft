export interface AccountType {
  name: string;
  type: string;
  requiresPassword: boolean;
}

export class LDAPAccountType implements AccountType {
  name = "LDAP";
  type = "ldap";
  requiresPassword = false;
}

export class LocalAccountType implements AccountType {
  name = "Локальная";
  type = "local";
  requiresPassword = true;
}

export class AccountTypeFactory {
  private static types: AccountType[] = [
    new LDAPAccountType(),
    new LocalAccountType(),
  ];

  static getAccountTypes(): AccountType[] {
    return this.types;
  }

  static getAccountTypeByType(type: string): AccountType | undefined {
    return this.types.find((t) => t.type === type);
  }

  static addAccountType(type: AccountType): void {
    // Теперь можно добавить новый тип без изменения существующего кода
    this.types.push(type);
  }
}
