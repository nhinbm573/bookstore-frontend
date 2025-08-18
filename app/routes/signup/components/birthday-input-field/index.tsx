import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface BirthdayInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues>;
}

export function BirthdayInputField<
  TFieldValues extends FieldValues = FieldValues,
>({ control }: BirthdayInputFieldProps<TFieldValues>) {
  return (
    <FormItem className="space-y-2">
      <FormLabel>Birthday (DD/MM/YYYY)</FormLabel>
      <div className="grid grid-cols-3 gap-2">
        <FormField
          control={control}
          name={"birthDay" as Path<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id={"birthDay"}
                  placeholder="DD"
                  className="bg-sky-100 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                  maxLength={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={"birthMonth" as Path<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id={"birthMonth"}
                  placeholder="MM"
                  className="bg-sky-100 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                  maxLength={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={"birthYear" as Path<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id={"birthYear"}
                  placeholder="YYYY"
                  className="bg-sky-100 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                  maxLength={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormMessage />
    </FormItem>
  );
}
