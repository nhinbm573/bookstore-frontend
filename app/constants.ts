export type TProfileDropdownContent = {
  id: string;
  label: string;
  href?: string;
};

export const PROFILE_DROPDOWN_CONTENT: TProfileDropdownContent[] = [
  {
    id: "my-profile",
    label: "My Profile",
    href: "/",
  },
  {
    id: "my-past-orders",
    label: "My Past Orders",
    href: "/",
  },
  {
    id: "logout",
    label: "Log out",
  },
];
