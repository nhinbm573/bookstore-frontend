import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { PROFILE_DROPDOWN_CONTENT } from "~/constants";
import { useProfileActions } from "~/features/auth/hooks/use-profile-actions";

export function ProfileDropdown() {
  const { handleItemClick, isSigningOut } = useProfileActions();

  return (
    <DropdownMenuContent
      className="bg-sky-300 shadow-lg rounded-md p-1 border-none min-w-[180px]"
      align="end"
      sideOffset={8}
      data-slot="profile-dropdown-content"
    >
      {PROFILE_DROPDOWN_CONTENT.map((item, index) => (
        <div key={item.id}>
          {item.id === "logout" && index > 0 && (
            <DropdownMenuSeparator className="bg-white/20 my-1" />
          )}
          <DropdownMenuItem
            className="text-white hover:bg-sky-400 focus:bg-sky-400 cursor-pointer px-3 py-2 rounded-sm transition-colors text-lg"
            onClick={() => handleItemClick(item)}
            disabled={item.id === "logout" && isSigningOut}
          >
            {item.id === "logout" && isSigningOut
              ? "Signing out..."
              : item.label}
          </DropdownMenuItem>
        </div>
      ))}
    </DropdownMenuContent>
  );
}
