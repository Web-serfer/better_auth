"use client";

import Link from "next/link";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { useSession, signOut } = createAuthClient();

const Navbar = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Логирование данных пользователя
  useEffect(() => {
    if (session?.user) {
      console.log("Текущий пользователь:", session.user);

      if (["google", "github"].includes(session.user.provider)) {
        console.log(
          `Данные ${session.user.provider}-пользователя:`,
          JSON.stringify(
            {
              id: session.user.id,
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
              provider: session.user.provider,
              ...(session.user.providerData && {
                providerData: session.user.providerData,
              }),
            },
            null,
            2
          )
        );
      } else if (session.user.provider === "credentials") {
        console.log("Пользователь по email/password:", {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          provider: session.user.provider,
        });
      }
    }
  }, [session]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Ошибка выхода:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!isMounted || isPending) {
    return (
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="text-xl font-bold text-gray-800">
          <Link href="/">Logo</Link>
        </div>
        <div className="text-gray-500">
          Загрузка состояния аутентификации...
        </div>
      </nav>
    );
  }

  const isSocialUser = ["google", "github"].includes(
    session?.user?.provider || ""
  );
  const hasAvatar = session?.user?.image && !avatarError && isSocialUser;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="text-xl font-bold text-gray-800">
        <Link href="/">Logo</Link>
      </div>

      <div className="flex items-center space-x-4">
        {session?.user ? (
          <div className="flex items-center gap-4">
            {isSocialUser ? (
              // Блок для социальных пользователей
              <div className="flex items-center gap-3">
                <div className="relative">
                  {hasAvatar ? (
                    <img
                      src={session.user.image}
                      alt="Аватар пользователя"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      width={40}
                      height={40}
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="bg-gray-100 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
                      <UserIcon />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
                </div>

                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="p-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Выйти"
                >
                  {isSigningOut ? <Spinner /> : <LogoutIcon />}
                </button>
              </div>
            ) : (
              // Блок для email/password пользователей
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 rounded-full p-2">
                  <UserIcon />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    Добро пожаловать
                  </span>
                  <span className="font-medium text-gray-800">
                    {session.user.name || session.user.email}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningOut ? (
                    <Spinner label="Выход..." />
                  ) : (
                    <>
                      <LogoutIcon />
                      <span>Выйти</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          // Блок для неавторизованных пользователей
          <div className="flex items-center gap-3">
            <AuthLink href="/sign-in">Войти</AuthLink>
            <AuthLink href="/sign-up" primary>
              Регистрация
            </AuthLink>
          </div>
        )}
      </div>
    </nav>
  );
};

// Иконка пользователя
const UserIcon = () => (
  <svg
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// Иконка выхода
const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

// Компонент спиннера
const Spinner = ({ label }: { label?: string }) => (
  <div className="flex items-center gap-2">
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    {label && <span>{label}</span>}
  </div>
);

// Компонент ссылки аутентификации
const AuthLink = ({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) => (
  <Link
    href={href}
    className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium hover:cursor-pointer ${
      primary
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
