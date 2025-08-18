import { Edit3 } from "lucide-react";
import type { FieldValues } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { PersonalInputFieldProps } from ".";

export function DefaultInputField<
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  isEditing,
  onEditClick,
  type = "text",
  readOnly = false,
}: PersonalInputFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <FormLabel className="text-lg font-medium text-gray-900 mb-2 block">
                {label}
              </FormLabel>
              {isEditing ? (
                <FormControl>
                  <Input
                    type={type}
                    className="max-w-md"
                    autoFocus
                    {...field}
                  />
                </FormControl>
              ) : (
                <p className="text-gray-600">{field.value}</p>
              )}
            </div>
            {!readOnly && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditClick(name)}
                className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
