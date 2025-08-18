import type { FieldValues, Path } from "react-hook-form";
import type { PersonalInputFieldProps } from ".";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Edit3 } from "lucide-react";

export function PasswordInputField<
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  isEditing,
  onEditClick,
  readOnly = false,
}: PersonalInputFieldProps<TFieldValues>) {
  return (
    <div className="py-4 border-b border-gray-200 flex items-start justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900 mb-2 block">
          Change Password
        </h3>
        {isEditing && (
          <div className="space-y-4 max-w-md">
            <FormField
              control={control}
              name={`${name}.oldPassword` as Path<TFieldValues>}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Current password"
                      className="max-w-md"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${name}.newPassword` as Path<TFieldValues>}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New password"
                      className="max-w-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${name}.confirmNewPassword` as Path<TFieldValues>}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="max-w-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {!readOnly && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEditClick(name)}
          className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
