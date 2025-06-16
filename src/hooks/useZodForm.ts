import { useEffect, useState } from "react";
import { type ZodType, type z } from "zod";

export function useZodForm<T extends ZodType>(
  schema: T,
  initialData: Record<string, unknown> = {},
) {
  type FormData = z.infer<T>;

  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(initialData as FormData);
    }
  }, [initialData]);

  useEffect(() => {
    validate();
  }, [formData]);

  const setValue = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): FormData | null => {
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setIsValid(false);
      return null;
    }

    setErrors({});
    setIsValid(true);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data as FormData;
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  const reset = () => {
    setFormData(initialData);
    setErrors({});
  };

  return {
    formData,
    setValue,
    errors,
    getFieldError,
    validate,
    reset,
    isValid,
  };
}
