import { shallowRef } from "vue";
import { z } from "zod";

export const RowSchema = z.object({
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
      name: z.enum(["LDAP", "Локальная"]),
      type: z.enum(["ldap", "local"]),
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
export const TableSchema = shallowRef<any>(z.array(RowSchema));
