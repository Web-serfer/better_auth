"use server";

import { auth } from "@/lib/auth/auth";

interface SignInResult {
  success: boolean;
  message?: string;
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
}

export async function signInEmailPassword(
  formData: FormData
): Promise<SignInResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";

  const errors: SignInResult["errors"] = {};

  // Базовая валидация на сервере
  if (!email) errors.email = "Введите email";
  if (!password) errors.password = "Введите пароль";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, message: "Исправьте ошибки в форме" };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { success: true, message: "Вход выполнен успешно!" };
  } catch (error) {
    console.error("Login error caught in server action:", error);

    let message = "Произошла неизвестная ошибка при входе.";
    const errors: SignInResult["errors"] = {};

    if (error instanceof Error) {
      if (
        error.message.includes("invalid_credentials") ||
        error.message.includes("Incorrect email or password")
      ) {
        message = "Неверный email или пароль.";
        errors.general = message;
      } else {
        message = "Произошла внутренняя ошибка сервера.";
        errors.general = error.message;
      }
    } else {
      errors.general = message;
    }

    return { success: false, message, errors };
  }
}
