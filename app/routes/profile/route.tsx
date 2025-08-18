import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { useForm, type Path } from "react-hook-form";
import { redirect, useNavigate } from "react-router";
import type z from "zod";
import { PersonalInputField } from "~/routes/profile/components/personal-input-field";
import { useAuthStore } from "~/features/auth/store";
import { useUpdateUser } from "~/features/auth/api";
import { formSchema } from "./schema";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import type { UpdateUserRequest } from "~/features/auth/types";

export async function clientLoader() {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  if (!isAuthenticated) {
    return redirect("/");
  }
}

export default function Profile() {
  const personalInfo = useAuthStore((state) => state.account);
  const { mutate: updateUser, isPending } = useUpdateUser();

  const navigate = useNavigate();

  const [editingField, setEditingField] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: personalInfo?.email || "",
      phone: personalInfo?.phone || "",
      fullName: personalInfo?.fullName || "",
      birthday: personalInfo?.birthday || "",
      password: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
    },
  });

  const watchedValues = form.watch();

  const hasChanges = useMemo(() => {
    if (!personalInfo) return false;

    const personalInfoChanged =
      watchedValues.email !== personalInfo.email ||
      watchedValues.phone !== personalInfo.phone ||
      watchedValues.fullName !== personalInfo.fullName ||
      watchedValues.birthday !== personalInfo.birthday;

    const passwordChanged =
      watchedValues.password.oldPassword !== "" ||
      watchedValues.password.newPassword !== "" ||
      watchedValues.password.confirmNewPassword !== "";

    return personalInfoChanged || passwordChanged;
  }, [watchedValues, personalInfo]);

  type ProfileFormValues = z.infer<typeof formSchema>;

  const handleEditClick = (fieldName: Path<ProfileFormValues>) => {
    if (editingField === "password") {
      form.clearErrors("password");
      form.setValue("password", {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
    if (editingField === fieldName) {
      setEditingField(null);
    } else {
      setEditingField(fieldName);
    }
  };

  const handleSubmit = () => {
    const values = form.getValues();
    const updateData: UpdateUserRequest = {
      fullName: values.fullName,
      phone: values.phone,
      birthday: values.birthday,
    };

    if (values.password.oldPassword && values.password.newPassword) {
      updateData.oldPassword = values.password.oldPassword;
      updateData.newPassword = values.password.newPassword;
    }

    updateUser(updateData, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  if (!personalInfo) {
    return (
      <div className="text-center text-gray-500">
        No personal information available.
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Form {...form}>
        <form className="space-y-6 px-4 pb-6 pt-2">
          <PersonalInputField
            control={form.control}
            name="fullName"
            label="Full Name"
            isEditing={editingField === "fullName"}
            onEditClick={handleEditClick}
          />
          <PersonalInputField
            control={form.control}
            name="password"
            label="Password"
            isEditing={editingField === "password"}
            onEditClick={handleEditClick}
          />
          <PersonalInputField
            control={form.control}
            name="email"
            label="Email Address"
            isEditing={false}
            onEditClick={handleEditClick}
            readOnly
          />
          <PersonalInputField
            control={form.control}
            name="phone"
            label="Phone Number"
            isEditing={editingField === "phone"}
            onEditClick={handleEditClick}
          />
          <PersonalInputField
            control={form.control}
            name="birthday"
            label="Birthday"
            type="date"
            isEditing={editingField === "birthday"}
            onEditClick={handleEditClick}
          />
          <div className="flex justify-center gap-4 mt-8 pt-6">
            <Button
              variant="outline"
              type="button"
              className="px-8 py-2 text-white hover:text-white bg-sky-400 hover:bg-sky-500"
              onClick={() => navigate("/")}
            >
              CANCEL
            </Button>
            <Button
              type="button"
              className="px-8 py-2 bg-orange-400 text-white hover:bg-orange-500"
              disabled={
                !hasChanges ||
                Object.keys(form.formState.errors).length > 0 ||
                isPending
              }
              onClick={handleSubmit}
            >
              {isPending ? "SAVING..." : "SAVE"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
