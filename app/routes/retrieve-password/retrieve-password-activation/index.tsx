import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useRetrievePasswordStore } from "~/features/retrieve-password/store";
import { openEmailClient } from "~/utils/email-helper";

export function RetrievePasswordActivation() {
  const email = useRetrievePasswordStore((state) => state.email);

  if (!email) {
    return (
      <div className="w-full text-center shadow-lg rounded-lg bg-white">
        <p className="text-gray-600">No activation details available.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-6 pt-2 text-center bg-white">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-gray-600">
            Please go to your email to retrieve your password.
          </p>
        </div>
        <Button
          onClick={() => openEmailClient(email)}
          className="w-full py-3 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-md"
        >
          GO TO EMAIL
        </Button>
        <p className="text-sm text-gray-500">
          Or continue{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            shopping
          </Link>{" "}
          without log in.
        </p>
      </div>
    </div>
  );
}
