export const getVerificationEmailTemplate = (verificationUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h1 style="color: #333; margin-top: 0;">Подтверждение email</h1>
      <p style="margin-bottom: 20px; line-height: 1.5;">Пожалуйста, подтвердите ваш email, нажав на кнопку ниже:</p>
      <a href="${verificationUrl}"
        style="display: inline-block; padding: 12px 24px;
        background-color: #4CAF50; color: white;
        text-decoration: none; border-radius: 4px; font-weight: bold; margin-bottom: 20px;">
        Подтвердить email
      </a>
      <p style="margin-top: 20px; color: #777; font-size: 14px;">
        Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.
      </p>
    </div>
  `;
};

export const verificationEmailSubject = "Подтвердите ваш email";

export const getPasswordResetEmailTemplate = (resetUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h1 style="color: #333; margin-top: 0;">Сброс пароля</h1>
      <p style="margin-bottom: 20px; line-height: 1.5;">Вы запросили сброс пароля для вашего аккаунта.</p>
      <p style="margin-bottom: 20px; line-height: 1.5;">Пожалуйста, нажмите на кнопку ниже, чтобы сбросить пароль:</p>
      <a href="${resetUrl}"
        style="display: inline-block; padding: 12px 24px;
        background-color: #007bff; color: white;
        text-decoration: none; border-radius: 4px; font-weight: bold; margin-bottom: 20px;">
        Сбросить пароль
      </a>
      <p style="margin-top: 20px; color: #777; font-size: 14px;">
        Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
      </p>
      <p style="margin-top: 10px; color: #777; font-size: 14px;">
        Эта ссылка действительна в течение 15 минут.
      </p>
    </div>
  `;
};

// Новый шаблон для сброса пароля через OTP
export const getPasswordResetOtpTemplate = (
  otp: string,
  expiresInMinutes: number = 5
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h1 style="color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Сброс пароля</h1>
      
      <div style="background-color: #fff; padding: 20px; border-radius: 4px; border-left: 4px solid #007bff; margin-bottom: 20px;">
        <p style="margin: 0 0 15px; font-size: 16px; line-height: 1.5;">Ваш одноразовый код для сброса пароля:</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; padding: 15px; background-color: #f5f5f5; border-radius: 4px; text-align: center; margin-bottom: 20px;">
          ${otp}
        </div>
        <p style="margin: 0; font-size: 14px; color: #666;">
          Введите этот код на странице сброса пароля для завершения процесса.
        </p>
      </div>
      
      <div style="background-color: #e8f4ff; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #0056b3;">
          <strong>Важно:</strong> Никому не сообщайте этот код.
        </p>
      </div>
      
      <p style="margin-bottom: 5px; font-size: 14px; color: #777;">Код действителен в течение <strong>${expiresInMinutes} минут</strong>.</p>
      <p style="margin: 0; font-size: 14px; color: #777;">Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
    </div>
  `;
};

export const passwordResetEmailSubject = "Запрос на сброс пароля";
export const passwordResetOtpSubject = "Ваш код для сброса пароля";
