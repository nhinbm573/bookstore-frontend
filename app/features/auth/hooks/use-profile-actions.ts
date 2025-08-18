import { useNavigate } from "react-router";
import { useSignOut } from "../api";
import type { TProfileDropdownContent } from "~/constants";

export function useProfileActions() {
  const navigate = useNavigate();
  const signOutMutation = useSignOut();

  const handleItemClick = (item: TProfileDropdownContent) => {
    if (item.href) {
      navigate(item.href);
    } else if (item.id === "logout") {
      signOutMutation.mutate();
    }
  };

  return {
    handleItemClick,
    isSigningOut: signOutMutation.isPending,
  };
}
