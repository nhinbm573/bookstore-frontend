import type { Control, FieldValues, Path } from "react-hook-form";
import { DefaultInputField } from "./default-input-field";
import { PasswordInputField } from "./password-input-field";

export interface PersonalInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  isEditing: boolean;
  onEditClick: (fieldName: Path<TFieldValues>) => void;
  type?: string;
  readOnly?: boolean;
}

export function PersonalInputField<
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
  const componentMap: Record<
    string,
    React.ComponentType<PersonalInputFieldProps<TFieldValues>>
  > = {
    password: PasswordInputField,
  };

  const InputComponent = componentMap[name] || DefaultInputField;
  return (
    <InputComponent
      control={control}
      name={name}
      label={label}
      isEditing={isEditing}
      onEditClick={onEditClick}
      type={type}
      readOnly={readOnly}
    />
  );
}
