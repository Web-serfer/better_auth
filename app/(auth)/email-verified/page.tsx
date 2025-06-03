"use client";

import Link from "next/link";

export default function EmailVerifiedPage() {
  return (
    <div className="h-screen flex items-start justify-center bg-white p-4 pt-20 md:pt-32">
      <div className="max-w-sm w-full text-center space-y-8">
        {/* Анимированный круг с иконкой */}
        <div className="mx-auto w-24 h-24 flex items-center justify-center relative mb-8">
          <div className="absolute inset-0 rounded-full bg-green-100 opacity-70 animate-pulse-circle" />
          <svg
            className="relative z-10 w-12 h-12 text-green-600"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"
            />
          </svg>
        </div>

        {/* Текстовый блок */}
        <div className="space-y-4">
          <h1 className="text-3xl font-light text-gray-800">Готово!</h1>
          <p className="text-gray-500 px-4">
            Ваш email успешно подтверждён. Можете начинать пользоваться
            сервисом.
          </p>
        </div>

        {/* Кнопка */}
        <Link
          href="/dashboard"
          className="inline-block w-full max-w-xs mx-auto px-6 py-3 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200 mt-8"
        >
          Перейти в сервис
        </Link>

        <style jsx global>{`
          @keyframes pulse-circle {
            0% {
              transform: scale(0.95);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.9;
            }
            100% {
              transform: scale(0.95);
              opacity: 0.7;
            }
          }
          .animate-pulse-circle {
            animation: pulse-circle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
