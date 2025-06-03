import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../../app/actions/send-email";
import { nextCookies } from "better-auth/next-js";
import { openAPI, emailOTP } from "better-auth/plugins";
import {
  getVerificationEmailTemplate,
  verificationEmailSubject,
  getPasswordResetOtpTemplate,
  passwordResetOtpSubject,
} from "../../lib/email";

const prisma = new PrismaClient();

const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "EMAIL_VERIFICATION_CALLBACK_URL",
  "BETTER_AUTH_URL",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      await sendEmail({
        to: user.email,
        subject: verificationEmailSubject,
        text: `Для подтверждения email перейдите по ссылке: ${verificationUrl}`,
        html: getVerificationEmailTemplate(verificationUrl),
      });
    },
  },

  plugins: [
    openAPI(),
    nextCookies(),
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        let subject: string;
        let htmlContent: string;
        let textContent: string;

        switch (type) {
          case "sign-in":
            subject = `Ваш код для входа: ${otp}`;
            htmlContent = `<p>Ваш одноразовый код для входа: <strong>${otp}</strong></p><p>Он действителен в течение 5 минут.</p>`;
            textContent = `Ваш одноразовый код для входа: ${otp}. Он действителен в течение 5 минут.`;
            break;

          case "email-verification":
            subject = `Ваш код для подтверждения email: ${otp}`;
            htmlContent = `<p>Ваш одноразовый код для подтверждения email: <strong>${otp}</strong></p><p>Он действителен в течение 5 минут.</p>`;
            textContent = `Ваш одноразовый код для подтверждения email: ${otp}. Он действителен в течение 5 минут.`;
            break;

          case "forget-password":
            // Используем специализированный шаблон для сброса пароля
            subject = passwordResetOtpSubject;
            htmlContent = getPasswordResetOtpTemplate(otp);
            textContent = `Ваш одноразовый код для сброса пароля: ${otp}. Используйте его на странице сброса пароля. Код действителен 5 минут.`;
            break;

          default:
            subject = `Ваш OTP: ${otp}`;
            htmlContent = `<p>Ваш одноразовый код: <strong>${otp}</strong></p><p>Он действителен в течение 5 минут.</p>`;
            textContent = `Ваш одноразовый код: ${otp}. Он действителен в течение 5 минут.`;
        }

        await sendEmail({
          to: email,
          subject,
          text: textContent,
          html: htmlContent,
        });
      },
    }),
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60, // Сессия действует 7 дней с момента создания или последнего обновления
    updateAge: 24 * 60 * 60, // Срок действия сессии обновляется каждые 1 день , если пользователь остаётся активным
  },
} satisfies BetterAuthOptions);
