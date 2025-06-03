"use client";

import Link from "next/link";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Инициализация клиента аутентификации
const { useSession, signOut } = createAuthClient();

const Navbar = () => {
  // Состояние аутентификации
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Состояния компонента
  const [isMounted, setIsMounted] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
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
        <div>Loading auth state...</div>
      </nav>
    );
  }

  // Определяем, является ли пользователь социальным (Google/GitHub)
  const isSocialUser =
    session?.user?.provider === "google" ||
    session?.user?.provider === "github";

  // Проверяем наличие аватара для социальных пользователей
  const hasAvatar = session?.user?.image && !avatarError && isSocialUser;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="text-xl font-bold text-gray-800">
        <Link href="/">Logo</Link>
      </div>

      <div className="flex items-center space-x-4">
        {session?.user ? (
          <div className="flex items-center gap-4">
            {/* Для социальных пользователей показываем только аватар */}
            {isSocialUser ? (
              <>
                <div className="flex items-center">
                  {hasAvatar ? (
                    <img
                      src={session.user.image}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      width={40}
                      height={40}
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                      <UserIcon />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="p-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Sign out"
                >
                  {isSigningOut ? <Spinner /> : <LogoutIcon />}
                </button>
              </>
            ) : (
              // Для обычных пользователей (email/password) показываем текстовое приветствие
              <>
                <span className="text-gray-700">
                  Hello, {session.user.name || session.user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningOut ? (
                    <Spinner label="Signing Out..." />
                  ) : (
                    <>
                      <LogoutIcon />
                      <span>Sign Out</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          // Для неавторизованных пользователей
          <>
            <AuthLink href="/sign-in">Sign In</AuthLink>
            <AuthLink href="/sign-up" primary>
              Sign Up
            </AuthLink>
          </>
        )}
      </div>
    </nav>
  );
};

// Компонент иконки пользователя
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

// Компонент иконки выхода
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

// Компонент индикатора загрузки
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
    className={`px-4 py-2 ${
      primary
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "text-gray-700 hover:text-gray-900"
    } rounded-md transition-colors duration-200 font-medium hover:cursor-pointer`}
  >
    {children}
  </Link>
);

export default Navbar;
