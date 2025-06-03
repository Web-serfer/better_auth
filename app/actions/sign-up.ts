"use server";

import { auth } from "@/lib/auth/auth";

interface SignUpResult {
  success: boolean;
  message?: string;
  errors?: {
    name?: string;
    email?: string;
    password?: string;
  };
}

export async function signUp(formData: FormData): Promise<SignUpResult> {
  // Получение данных формы
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";

  // Валидация
  const errors: SignUpResult["errors"] = {};

  if (!name) errors.name = "Введите имя";
  if (!email) errors.email = "Введите email";
  if (!password) errors.password = "Введите пароль";

  if (password.length < 8)
    errors.password = "Пароль должен содержать минимум 8 символов";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Неверный формат email";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, message: "Исправьте ошибки в форме" };
  }

  try {
    // регистрация через  name, email, password
    await auth.api.signUpEmail({
      body: { name, email, password },
    });

    return {
      success: true,
      message: "Регистрация успешна! Проверьте email для подтверждения.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    let message = "Ошибка регистрации";
    const errors: SignUpResult["errors"] = {};

    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        message = "Этот email уже зарегистрирован";
        errors.email = message;
      } else if (error.message.includes("invalid email")) {
        message = "Некорректный email";
        errors.email = message;
      } else if (error.message.includes("password")) {
        message = "Ненадежный пароль";
        errors.password = message;
      }
    }

    return {
      success: false,
      message,
      errors,
    };
  }
}
