import { shallowRef, toValue, type MaybeRefOrGetter } from "vue";
import { z } from "zod";
import { RowSchema } from "../schemas/accountSchema";

export const AccountSchema = RowSchema;
export type AccountSchema = z.infer<typeof AccountSchema>;

export const AccountsArraySchema = shallowRef<any>(z.array(AccountSchema));

export const accountValidation = {
  // Валидация одной записи
  async validateAccount(data: MaybeRefOrGetter<AccountSchema>) {
    return await toValue(AccountSchema).safeParseAsync(toValue(data));
  },

  // Валидация массива записей
  async validateAccounts<U>(data: MaybeRefOrGetter<U>) {
    return await toValue(AccountsArraySchema).safeParseAsync(toValue(data));
  },

  // Получение ошибок по индексу и полю
  getErrorByIndexAndField(
    errors: MaybeRefOrGetter<Record<number, Record<string, string>>>,
    index: number,
    field: string
  ) {
    return toValue(errors)[index]?.[field];
  },
};
