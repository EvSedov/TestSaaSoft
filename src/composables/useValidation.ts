import { ref, watch, toValue, type MaybeRefOrGetter } from "vue";
import type { ZodTypeAny } from "zod/v3";

export default function <T extends ZodTypeAny, U = Record<string, unknown>>(
  schema: MaybeRefOrGetter<T>,
  data: MaybeRefOrGetter<U>,
  options?: { mode: "eager" | "lazy" }
) {
  const opts = Object.assign({}, { mode: "lazy" }, options);
  const isValid = ref(true);
  let unwatch: null | (() => void) = null;
  const errors = ref<Record<number, Record<string, string>>>({});

  const clearErrors = () => {
    errors.value = {};
  };

  const validationWatch = () => {
    if (unwatch !== null) {
      return;
    }

    unwatch = watch(
      [() => toValue(data), () => toValue(schema)],
      async () => {
        await validate();
      },
      { deep: true }
    );
  };

  const validate = async () => {
    clearErrors();
    const result = await toValue(schema).safeParseAsync(toValue(data));
    isValid.value = result.success;
    errors.value = {};

    if (!result.success) {
      const newErrors: Record<number, Record<string, string>> = {};

      result.error.issues.forEach((fieldError: any) => {
        const path = fieldError.path;
        if (path.length >= 2 && typeof path[0] === "number") {
          const rowIndex = path[0];
          const fieldName = path[1] as string;

          if (!newErrors[rowIndex]) {
            newErrors[rowIndex] = {};
          }
          newErrors[rowIndex][fieldName] = fieldError.message;
        }
      });

      errors.value = newErrors;
      validationWatch();
    }

    return errors;
  };

  const getError = (name: string, index: number) => errors.value[index]?.[name];

  if (opts.mode === "eager") {
    validationWatch();
  }

  return { validate, errors, isValid, clearErrors, getError };
}
