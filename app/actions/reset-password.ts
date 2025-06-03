"use server";

import { authClient } from "@/lib/auth/auth-client";

interface ResetPasswordResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function resetPasswordWithOtp(
  prevState: ResetPasswordResult,
  formData: FormData
): Promise<ResetPasswordResult> {
  const email = formData.get("email")?.toString().trim() || "";
  const otp = formData.get("otp")?.toString().trim() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  // === Безопасное логирование для отладки ===
  const logPrefix = "DEBUG [resetPasswordWithOtp]:";
  console.log(`${logPrefix} START`);
  console.log(`${logPrefix} Email: ${email}`);
  console.log(`${logPrefix} OTP: ${otp.substring(0, 3)}***`);
  console.log(`${logPrefix} Password length: ${password.length}`);
  console.log(
    `${logPrefix} Confirm Password length: ${confirmPassword.length}`
  );

  // 1. Базовая валидация полей
  if (!email || !otp || !password || !confirmPassword) {
    console.log(`${logPrefix} Validation failed - missing fields`);
    return { success: false, message: "Все поля обязательны для заполнения" };
  }

  // 2. Проверка совпадения паролей
  if (password !== confirmPassword) {
    console.log(`${logPrefix} Validation failed - password mismatch`);
    return { success: false, message: "Пароли не совпадают" };
  }

  // 3. Проверка сложности пароля
  if (password.length < 8) {
    console.log(`${logPrefix} Validation failed - password too short`);
    return {
      success: false,
      message: "Пароль должен быть не менее 8 символов",
    };
  }

  try {
    // 4. Используем встроенную проверку better-auth вместо getUserByEmail
    console.log(`${logPrefix} Attempting password reset via OTP`);

    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
      type: "forget-password",
    });

    if (error) {
      console.error(`${logPrefix} Reset error: ${error.message}`);

      // Обработка специфичных ошибок better-auth
      if (error.message.includes("Invalid OTP")) {
        return {
          success: false,
          message: "Неверный или просроченный код подтверждения",
        };
      }

      if (error.message.includes("MAX_ATTEMPTS_EXCEEDED")) {
        return {
          success: false,
          message: "Превышено количество попыток. Запросите новый код.",
        };
      }

      if (
        error.message.includes("USER_NOT_FOUND") ||
        error.message.includes("user not found")
      ) {
        return {
          success: false,
          message: "Пользователь с таким email не найден",
        };
      }

      return {
        success: false,
        message: "Ошибка при сбросе пароля",
        error: error.message,
      };
    }

    console.log(`${logPrefix} Password reset successful`);
    return {
      success: true,
      message: "Пароль успешно изменён! Теперь можно войти.",
    };
  } catch (error: any) {
    console.error(`${logPrefix} Unhandled error: ${error.message}`);
    return {
      success: false,
      message: "Произошла непредвиденная ошибка. Попробуйте позже.",
    };
  } finally {
    console.log(`${logPrefix} END`);
  }
}
