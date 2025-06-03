"use client";

import React, { useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signUp } from "../../actions/sign-up";
import { authClient } from "../../../lib/auth/auth-client";
import Loader from "@/components/Loader";
import { Toast } from "@/components/Toast";
import SocialSignInButton from "@/components/auth/SocialSignInButton";

interface SignUpResult {
  success: boolean;
  message?: string;
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  };
}

const SignUpPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<SignUpResult["errors"]>({});
  const [toaster, setToaster] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ show: false, message: "", type: "info" });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    github: false,
  });

  // Обработчик успешной аутентификации
  const handleAuthSuccess = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  // Auto-hide toaster after 5 seconds
  useEffect(() => {
    if (toaster.show) {
      const timer = setTimeout(() => {
        setToaster((prev) => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toaster.show]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setToaster({ show: false, message: "", type: "info" });
    setShowSuccessMessage(false);

    try {
      const result = await signUp(new FormData(event.currentTarget));

      if (result.success) {
        setToaster({
          show: true,
          message:
            result.message ||
            "Регистрация успешна! Проверьте email для подтверждения.",
          type: "success",
        });
        setShowSuccessMessage(true);
      } else {
        setErrors(result.errors || {});
        setToaster({
          show: true,
          message: result.message || "Произошла ошибка при регистрации.",
          type: "error",
        });
      }
    } catch (clientError) {
      console.error("Непредвиденная ошибка на клиенте:", clientError);
      setToaster({
        show: true,
        message:
          "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.",
        type: "error",
      });
      setErrors({ general: "Произошла непредвиденная ошибка." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик для социальной аутентификации
  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      setSocialLoading((prev) => ({ ...prev, [provider]: true }));
      setToaster({ show: false, message: "", type: "info" });

      await authClient.signIn.social({ provider });

      // Перенаправление после успешной аутентификации
      handleAuthSuccess();
    } catch (error: any) {
      setToaster({
        show: true,
        message: `Ошибка входа через ${
          provider === "google" ? "Google" : "GitHub"
        }: ${error.message || "Проверьте консоль для деталей"}`,
        type: "error",
      });
      console.error(`Social sign-in error (${provider}):`, error);
    } finally {
      setSocialLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="fixed top-4 right-4 z-50">
        {toaster.show && (
          <Toast
            message={toaster.message}
            type={toaster.type}
            onClose={() => setToaster((prev) => ({ ...prev, show: false }))}
          />
        )}
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="rounded-lg bg-white px-8 py-8 shadow">
          {showSuccessMessage ? (
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-green-600 mb-4">
                Регистрация почти завершена!
              </h3>
              <p className="text-gray-700 text-lg">
                Мы отправили письмо с подтверждением на ваш email. Пожалуйста,
                проверьте свою почту (включая папку "Спам" или "Нежелательные")
                и перейдите по ссылке, чтобы активировать аккаунт.
              </p>
              <p className="mt-6 text-sm text-gray-500">
                Вы сможете войти в свой аккаунт после подтверждения email.
              </p>
              <a
                href="/sign-in"
                className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Вернуться на страницу входа
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors?.general && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {errors.general}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className={`block w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                      errors?.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                      errors?.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={`block w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                      errors?.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                  {errors?.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:cursor-pointer ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader className="mr-2" />
                      Signing up...
                    </span>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>
            </form>
          )}

          {!showSuccessMessage && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <SocialSignInButton
                    provider="google"
                    isLoading={socialLoading.google}
                    disabled={socialLoading.google || socialLoading.github}
                    onClick={() => handleSocialSignIn("google")}
                  />

                  <SocialSignInButton
                    provider="github"
                    isLoading={socialLoading.github}
                    disabled={socialLoading.github || socialLoading.google}
                    onClick={() => handleSocialSignIn("github")}
                  />
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/sign-in"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
