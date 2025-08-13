import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { PROFILE_DROPDOWN_CONTENT } from "~/constants";

export function ProfileDropdown() {
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
          <DropdownMenuItem className="text-white hover:bg-sky-400 focus:bg-sky-400 cursor-pointer px-3 py-2 rounded-sm transition-colors text-lg">
            {item.label}
          </DropdownMenuItem>
        </div>
      ))}
    </DropdownMenuContent>
  );
}
