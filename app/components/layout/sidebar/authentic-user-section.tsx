import { useNavigate } from "react-router";
import { useAuthStore } from "~/features/auth/store";
import { PROFILE_DROPDOWN_CONTENT } from "~/constants";
import { useProfileActions } from "~/features/auth/hooks/use-profile-actions";

export function AuthenticUserSection() {
  const account = useAuthStore((state) => state.account);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { handleItemClick, isSigningOut } = useProfileActions();

  const navigate = useNavigate();

  if (!account || account === null || !isAuthenticated) {
    navigate("/signin");
    return;
  }

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-800 mb-3">{account.fullName}</h3>
      <div className="space-y-1" data-slot="sidebar-sign-in">
        {PROFILE_DROPDOWN_CONTENT.map((item) => (
          <div
            key={item.id}
            className={`text-sky-500 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer ${
              item.id === "logout" && isSigningOut
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
            onClick={() => handleItemClick(item)}
          >
            {item.id === "logout" && isSigningOut
              ? "Signing out..."
              : item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
