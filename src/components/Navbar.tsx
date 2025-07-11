
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sun, Moon, Bell, Search, Menu, Check } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  width: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  className?: string;
}

export function Navbar({
  width,
  sidebarOpen,
  onToggleSidebar,
  className = "",
}: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show menu icon:
  // - Mobile (≤ 640px): when sidebar is closed
  // - SM/MD (641px–1024px): when sidebar is closed
  const showBurger =
    mounted &&
    ((width <= 640 && !sidebarOpen) ||
      (width > 640 && width <= 1024 && !sidebarOpen));
  console.log(
    "Navbar - showBurger:",
    showBurger,
    "sidebarOpen:",
    sidebarOpen,
    "width:",
    width
  ); // Debug log

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "revenue changed in Account table" },
    { id: 2, message: "revenue changed in Account table" },
    { id: 3, message: "revenue changed in Account table" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const markAsRead = (id: number) =>
    setNotifications((n) => n.filter((x) => x.id !== id));

  return (
    <header
      className={`bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-gray-900 dark:to-gray-800 flex items-center justify-between h-16 px-3 sm:px-4 md:px-6 ${className}`}
    >
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 md:flex-none">
        {showBurger && (
          <button
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSidebar();
            }}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-emerald-100 dark:text-white" />
          </button>
        )}

        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute top-1/2 left-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white dark:bg-gray-900 px-8 sm:px-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 outline-none text-gray-700 dark:text-gray-100 text-sm sm:text-base md:w-1/2"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        <button
          aria-label="Toggle theme"
          onClick={() => setDarkMode((m) => !m)}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
        >
          {darkMode ? (
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
          ) : (
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
          )}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            aria-label="Notifications"
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
            {notifications.length > 0 && (
              <>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 top-full w-72 sm:w-80 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Notification
              </h4>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="group flex items-start justify-between space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {n.message}
                    </p>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => markAsRead(n.id)}
                    >
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </button>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    No notifications
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/user-profile"
          className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-md p-1 transition-colors"
        >
          <Image
            src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
            alt="User Avatar"
            width={32}
            height={32}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
          />
          <span className="hidden sm:inline text-slate-200 font-medium text-sm sm:text-base">
            Vyom
          </span>
        </Link>
      </div>
    </header>
  );
}


























