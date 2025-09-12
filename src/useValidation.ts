import { z } from "zod";
import { get, groupBy } from "lodash-es";
import { ref, watch, toValue, type MaybeRefOrGetter } from "vue";
import type { ZodTypeAny } from "zod/v3";

export default function <
  T extends ZodTypeAny,
  U = Record<string, unknown>,
  V = Record<string, z.ZodError[]>
>(
  schema: MaybeRefOrGetter<T>,
  data: MaybeRefOrGetter<U>,
  options?: { mode: "eager" | "lazy" }
) {
  const opts = Object.assign({}, { mode: "lazy" }, options);

  const isValid = ref(true);

  let unwatch: null | (() => void) = null;

  const errors = ref<V | null>(null);

  const clearErrors = () => {
    errors.value = null;
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
    console.log({ result });

    isValid.value = result.success;

    if (!result.success) {
      errors.value = groupBy(result.error.issues, "path");
      validationWatch();
    }

    return errors;
  };

  const getError = (path: string) =>
    get(errors.value, `0,${path.replace(/\./g, ",")}.0.message`);

  if (opts.mode === "eager") {
    validationWatch();
  }

  return { validate, errors, isValid, clearErrors, getError };
}
