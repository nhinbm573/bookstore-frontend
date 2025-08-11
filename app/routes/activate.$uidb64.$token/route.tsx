import type { LoaderFunctionArgs } from "react-router";
import { activateAccount } from "~/features/auth/services";
import { useLoaderData, Link } from "react-router";
import { toast } from "sonner";
import { useEffect } from "react";
import { CheckIcon } from "~/components/icons/check-icon";
import { XIcon } from "~/components/icons/x-icon";

export async function loader({ params }: LoaderFunctionArgs) {
  const { uidb64, token } = params;

  if (!uidb64 || !token) {
    return {
      success: false,
      message:
        "Invalid activation link. Please check your email for the correct link.",
      shouldRedirect: true,
    };
  }

  try {
    const result = await activateAccount({ uidb64, token });
    return {
      success: true,
      message:
        result.message || "Your account has been successfully activated!",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Activation failed. The link may be expired or invalid.",
    };
  }
}

export default function ActivateRoute() {
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  }, [data]);

  if (data.shouldRedirect) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <p className="text-gray-600 mb-4">{data.message}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        {data.success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon width={32} height={32} color="rgb(34 197 94)" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Account Activated!
            </h1>
            <p className="text-gray-600">{data.message}</p>
            <Link
              to="/login"
              className="inline-block mt-4 px-6 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XIcon width={32} height={32} color="rgb(239 68 68)" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Activation Failed
            </h1>
            <p className="text-gray-600">{data.message}</p>
            <div className="space-y-2 mt-4">
              <Link
                to="/signup"
                className="block px-6 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
              >
                Try Signing Up Again
              </Link>
              <Link
                to="/"
                className="block px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
