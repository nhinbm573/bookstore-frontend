import { useNavigate } from "react-router";

export function GuestUserSection() {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-800 mb-3">Guest user</h3>
      <div className="space-y-1" data-slot="sidebar-sign-in">
        <div
          className="text-sky-500 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Sign in
        </div>
        <div
          className="text-sky-500 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate("/signup")}
          data-slot="sidebar-sign-up"
        >
          Sign up
        </div>
      </div>
    </div>
  );
}
