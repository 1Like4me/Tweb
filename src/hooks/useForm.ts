import { FormEvent, useCallback, useState } from 'react';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type Validator<T> = (values: T) => FormErrors<T>;

export interface UseFormOptions<T> {
  initialValues: T;
  validate?: Validator<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (field: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [setValues]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);
        const hasErrors = Object.values(validationErrors).some(Boolean);
        if (hasErrors) {
          return;
        }
      }
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, validate, values]
  );

  return {
    values,
    setValues,
    errors,
    setErrors,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};

