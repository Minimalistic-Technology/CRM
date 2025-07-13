
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

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: "account" | "campaign" | "meeting" | "lead" | "deal";
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export function Navbar({
  width,
  sidebarOpen,
  onToggleSidebar,
  className = "",
}: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // very IMP : The User ID  is critical because notifications are tied to a specific userId (e.g., "manan")
  const currentUserId = "manan";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:5000/api/notifications/${currentUserId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to fetch notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/read/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the notification from the local state
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);

  // Show menu icon:
  // - Mobile (≤ 640px): when sidebar is closed
  // - SM/MD (641px–1024px): when sidebar is closed
  const showBurger =
    mounted &&
    ((width <= 640 && !sidebarOpen) ||
      (width > 640 && width <= 1024 && !sidebarOpen));

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
            {unreadNotifications.length > 0 && (
              <>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadNotifications.length}
                </span>
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 top-full w-72 sm:w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Notifications
                  </h4>
                  {unreadNotifications.length > 0 && (
                    <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">
                      {unreadNotifications.length} new
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Loading notifications...
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500 dark:text-red-400">
                    {error}
                  </div>
                ) : unreadNotifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                ) : (
                  <div className="space-y-1">
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="group flex items-start justify-between space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          onClick={() => markAsRead(notification._id)}
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {unreadNotifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      // Mark all as read
                      unreadNotifications.forEach((n) => markAsRead(n._id));
                    }}
                    className="w-full text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
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




















// try
