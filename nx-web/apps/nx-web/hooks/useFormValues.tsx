import { FieldValues, UseFormReturn } from "react-hook-form";

export function useFormValues<T extends FieldValues>(form: UseFormReturn<T>) {
   const values = form.watch();
   return values;
}

export function useFormKeys<T extends FieldValues>(form: UseFormReturn<T>) {
   const values = form.watch();
   return Object.keys(values);
}
