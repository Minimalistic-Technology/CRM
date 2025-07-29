"use client";
// done api working
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sun, Moon, Bell, Search, Menu, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

interface Address {
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
}

interface UserProfile {
  _id?: string;
  avatarUrl: string;
  fullName: string;
  role: string;
  location: string;
  social?: SocialLinks;
  personal: PersonalInfo;
  address: Address;
}

interface Notification {
  _id: string;
  userId?: string;
  message: string;
  type: "account" | "campaign" | "meeting" | "lead" | "deal";
  read: boolean;
  createdAt: string;
  readAt?: string;
}

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/crm/user-profiles",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const profiles = await response.json();

        if (!response.ok) {
          throw new Error(profiles.error || "Failed to fetch profiles");
        }
        console.log("Fetched profiles:", profiles);

        const userProfile = profiles.find((p: UserProfile) => p.personal.email === email);

        if (!userProfile) {
          throw new Error("Profile not found for this email");
        }

        setProfile(userProfile);
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          "http://localhost:5000/api/crm/notifications/global"
        );
        const data: Notification[] = await res.json();
        setNotifications(data.filter((n) => !n.read));
      } catch {
        setError("Failed to fetch notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 10000);
    return () => clearInterval(iv);
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

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/crm/notifications/read/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      if (updated.read) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch {
      // Silent failure
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/crm/search?query=${encodeURIComponent(
          searchQuery
        )}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`Search failed: HTTP ${res.status}`);
      const data: { match: string; id: string } = await res.json();
      console.log("Search API response:", data);
      const routeMap: { [key: string]: string } = {
        leads: "/leads",
        meetings: "/meeting",
        campaigns: "/campaign",
        contacts: "/contact",
        deals: "/deal",
        tasks: "/task",
        accounts: "/account",
      };

      const baseRoute = routeMap[data.match.toLowerCase()];
      if (baseRoute) {
        const navigationPath = `${baseRoute}/${data.id}`;
        try {
          await router.push(navigationPath);
        } catch (navError) {
          console.error("Navigation failed:", navError);
          alert(
            `Navigation failed: Page not found for ${navigationPath}. Please ensure the dynamic route (e.g., pages${baseRoute}/[id].tsx) exists.`
          );
        }
      } else {
        alert(`No route defined for match type: ${data.match}`);
      }
    } catch (err: any) {
      console.error("Search error:", err);
      alert(`Search failed: ${err.message || err}`);
    }
  };

  const unread = notifications.filter((n) => !n.read);
  const showBurger =
    mounted &&
    ((width <= 640 && !sidebarOpen) ||
      (width > 640 && width <= 1024 && !sidebarOpen) ||
      (width > 1024 && width <= 1700 && !sidebarOpen));

  return (
    <header
      className={`bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-gray-900 dark:to-gray-800 flex items-center justify-between h-16 px-3 sm:px-4 md:px-6 ${className}`}
    >
      <div className="flex items-center space-x-2 flex-1 md:flex-none">
        {showBurger && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSidebar();
            }}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="w-5 h-5 text-emerald-100 dark:text-white" />
          </button>
        )}

        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute top-1/2 left-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 -translate-y-1/2" />
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 px-8 sm:px-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 outline-none text-gray-700 dark:text-gray-100 text-sm sm:text-base"
            />
          </form>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setDarkMode((m) => !m)}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
          ) : (
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
          )}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-1 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 top-full w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Notification
              </h4>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {loading && (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </p>
                )}
                {error && (
                  <p className="text-center text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}
                {!loading && !error && notifications.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </p>
                )}
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className="group flex items-start justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {n.message}
                    </p>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => markAsRead(n._id)}
                    >
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </button>
                  </div>
                ))}
              </div>
              {unread.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <button
                    onClick={() => unread.forEach((n) => markAsRead(n._id))}
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
          className="flex items-center space-x-2 p-1 rounded-md hover:bg-white/10 transition-colors"
        >
          <Image
            src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="hidden sm:inline text-slate-200 font-medium">
            {profile?.fullName || "User"}
          </span>
        </Link>
      </div>
    </header>
  );
}
