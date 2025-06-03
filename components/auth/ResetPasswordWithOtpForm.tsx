"use client";

import { useFormState, useFormStatus } from "react-dom";
import { resetPasswordWithOtp } from "@/app/actions/reset-password";

export function ResetPasswordWithOtpForm({ email }: { email: string }) {
  const [state, formAction] = useFormState(resetPasswordWithOtp, {
    success: false,
    message: null,
  });

  return (
    <div className="flex flex-col gap-5">
      <p className="mb-2 text-gray-600 text-sm">
        OTP sent to <span className="font-medium text-gray-800">{email}</span>.
        Please enter it below with your new password.
      </p>

      <form action={formAction} className="flex flex-col gap-5">
        <input type="hidden" name="email" value={email} />

        <div>
          <label
            htmlFor="otp"
            className="block mb-2 font-medium text-gray-800 text-left"
          >
            OTP Code
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            placeholder="Enter 6-digit OTP"
            required
            className="w-full p-3 border border-gray-300 rounded-md text-base"
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block mb-2 font-medium text-gray-800 text-left"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
            required
            minLength={8}
            className="w-full p-3 border border-gray-300 rounded-md text-base"
          />
        </div>

        {state.message && (
          <p
            className={`p-3 rounded-md text-sm ${
              state.success
                ? "text-green-700 bg-green-100 border border-green-200"
                : "text-red-700 bg-red-100 border border-red-200"
            }`}
          >
            {state.message}
          </p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`p-3 text-white rounded-md text-base transition-colors ${
        pending
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
      }`}
    >
      {pending ? "Resetting Password..." : "Reset Password"}
    </button>
  );
}
