"use client";

import React, { useEffect, useState } from "react";
import { useFormStatus, useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { searchAccountByEmail } from "@/app/actions/forgot-account";
import { resetPasswordWithOtp } from "@/app/actions/reset-password";

// Типы должны соответствовать серверным действиям
type AccountSearchState = {
  success: boolean;
  message: string | null;
  error: string | null;
  needsOtp?: boolean;
};

type ResetPasswordState = {
  success: boolean;
  message: string | null;
  error: string | null;
};

// Кнопка отправки для формы поиска аккаунта
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
      {pending ? "Searching..." : "Find account"}
    </button>
  );
}

// Кнопка отправки для формы сброса пароля
function ResetSubmitButton() {
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
      {pending ? "Processing..." : "Reset Password"}
    </button>
  );
}

// Компонент формы сброса пароля
function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Прямое использование серверного действия
  const [state, formAction] = useFormState<ResetPasswordState, FormData>(
    resetPasswordWithOtp,
    {
      success: false,
      message: null,
      error: null,
    }
  );

  // Обработка успешного сброса пароля
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => router.push("/sign-in"), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  // Проверка совпадения паролей перед отправкой
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    // Если пароли совпадают - отправляем форму
    setPasswordsMatch(true);
    const formData = new FormData(form);
    formAction(formData);
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="mb-2 text-gray-600 text-sm">
        An OTP has been sent to{" "}
        <span className="font-medium text-gray-800">{email}</span>. Please enter
        the OTP and your new password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            pattern="\d{6}"
            title="Please enter a 6-digit code"
            className="w-full p-3 border border-gray-300 rounded-md text-base"
            onInput={(e) => {
              // Разрешаем только цифры
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
              // Ограничиваем длину 6 символами
              if (e.currentTarget.value.length > 6) {
                e.currentTarget.value = e.currentTarget.value.slice(0, 6);
              }
            }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 font-medium text-gray-800 text-left"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter new password (min 8 characters)"
            required
            minLength={8}
            className="w-full p-3 border border-gray-300 rounded-md text-base"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block mb-2 font-medium text-gray-800 text-left"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm new password"
            required
            minLength={8}
            className="w-full p-3 border border-gray-300 rounded-md text-base"
            onChange={(e) => {
              const password = (
                e.currentTarget.form?.elements.namedItem(
                  "password"
                ) as HTMLInputElement
              )?.value;
              setPasswordsMatch(password === e.target.value);
            }}
          />
        </div>

        {!passwordsMatch && (
          <p className="text-red-500 text-sm">Passwords do not match</p>
        )}

        {state.error && (
          <p className="p-3 rounded-md text-sm text-red-700 bg-red-100 border border-red-200">
            {state.error}
          </p>
        )}

        {state.message && (
          <p className="p-3 rounded-md text-sm text-green-700 bg-green-100 border border-green-200">
            {state.message}
          </p>
        )}

        <ResetSubmitButton />
      </form>
    </div>
  );
}

// Основной компонент страницы
export default function ForgotAccountPage() {
  const [email, setEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Прямое использование серверного действия
  const [state, formAction] = useFormState<AccountSearchState, FormData>(
    searchAccountByEmail,
    {
      success: false,
      message: null,
      error: null,
      needsOtp: false,
    }
  );

  // Обработка успешного поиска аккаунта
  useEffect(() => {
    if (state.success && state.needsOtp) {
      setShowResetForm(true);
      setResetEmail(email);
    }
  }, [state, email]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-5">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl mb-5 text-gray-800 font-bold">
          {showResetForm ? "Reset Your Password" : "Find Your Account"}
        </h2>

        {showResetForm ? (
          <ResetPasswordForm email={resetEmail} />
        ) : (
          <>
            <p className="mb-7 text-gray-600 text-sm">
              Enter your email address to receive a password reset OTP
            </p>

            <form action={formAction} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 font-medium text-gray-800 text-left"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md text-base"
                />
              </div>

              {state.error && (
                <p className="p-3 rounded-md text-sm text-red-700 bg-red-100 border border-red-200">
                  {state.error}
                </p>
              )}

              {state.message && (
                <p className="p-3 rounded-md text-sm text-green-700 bg-green-100 border border-green-200">
                  {state.message}
                </p>
              )}

              <SubmitButton />
            </form>
          </>
        )}
      </div>
    </div>
  );
}
