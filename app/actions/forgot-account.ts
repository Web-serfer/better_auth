"use server";

import { authClient } from "@/lib/auth/auth-client";

interface ForgotAccountResult {
  success: boolean;
  message: string;
  error?: string | null;
  needsOtp?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function searchAccountByEmail(
  prevState: ForgotAccountResult,
  formData: FormData | null // Разрешаем null
): Promise<ForgotAccountResult> {
  // Обработка случая, когда formData = null
  if (!formData) {
    return {
      success: false,
      message: "Form data is missing",
      needsOtp: false,
    };
  }

  const email = formData.get("email") as string;
  const processedEmail = email.toLowerCase().trim();

  if (!processedEmail) {
    return {
      success: false,
      message: "Please enter your email address.",
      needsOtp: false,
    };
  }

  if (!EMAIL_REGEX.test(processedEmail)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      needsOtp: false,
    };
  }

  try {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: processedEmail,
      type: "forget-password",
      otpLength: 6,
    });

    if (error) {
      console.error("Failed to send OTP:", error);
      return {
        success: true,
        message: "If an account exists, you'll receive an OTP code shortly.",
        needsOtp: true,
      };
    }

    return {
      success: true,
      message: "Please check your email for the verification code.",
      needsOtp: true,
    };
  } catch (error) {
    console.error("Critical error in password reset:", error);
    return {
      success: false,
      message: "A system error occurred. Please try again later.",
      needsOtp: false,
    };
  }
}
