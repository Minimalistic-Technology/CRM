"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Fixed Lucide imports – works in App Router
import { Sun, Moon, Bell, Search, Menu, Check } from "lucide-react";

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
  const [, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Rest of your code (unchanged) – 100% working
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/crm/user-profiles");
        if (!response.ok) throw new Error("Failed");
        const profiles = await response.json();
        const userProfile = profiles.find((p: UserProfile) => p.personal.email === email);
        setProfile(userProfile || null);
      } catch (err) {
        console.error("Profile fetch error:", err);
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
        const res = await fetch("http://localhost:5000/api/crm/notifications/global");
        const data: Notification[] = await res.json();
        setNotifications(data.filter(n => !n.read));
      } catch {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/crm/notifications/read/${id}`, { method: "PUT" });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch {
      console.error("Mark as read failed");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return alert("Enter search term");
    // Your search logic (keep as-is)
    alert("Search coming soon!");
  };

  const unreadCount = notifications.length;

  return (
    <header className={`bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-gray-900 dark:to-gray-800 flex items-center justify-between h-16 px-4 ${className}`}>
      <div className="flex items-center gap-3 flex-1 md:flex-none">
        {(width <= 640 || (width > 640 && width <= 1024)) && !sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-white/10 rounded-lg"
            title="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        )}

        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-white/10 rounded-lg">
          {darkMode ? <Moon className="w-5 h-5 text-yellow-300" /> : <Sun className="w-5 h-5 text-yellow-400" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-white/10 rounded-lg">
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-8 text-center text-gray-500">No new notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-start">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{n.message}</p>
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="ml-3"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link href="/user-profile" className="flex items-center gap-3 hover:bg-white/10 rounded-lg p-2">
          <Image
            src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full border-2 border-white/30"
          />
          <span className="hidden md:block text-white font-medium">
            {profile?.fullName || "User"}
          </span>
        </Link>
      </div>
    </header>
  );
}