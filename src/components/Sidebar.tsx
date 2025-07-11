
// responsive  sidebar for mobile view & sm .


"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Menu,
  Phone,
  CheckSquare,
  Megaphone,
  Calendar,
  Building,
  Handshake,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  width: number;
  isOpen: boolean;
  onToggleSidebar: () => void;
  className?: string;
}

export function Sidebar({
  width,
  isOpen,
  onToggleSidebar,
  className = "",
}: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const isMobile = width <= 640;
  const isTablet = width > 640 && width <= 1024;

  const handleItemClick = (to: string) => {
    router.push(to);
    if (isMobile && isOpen) onToggleSidebar(); // Close only in mobile
  };

  // Show Chevron in mobile and tablet when open
  const showChevron = mounted && (isMobile || isTablet) && isOpen;

  // Debug log to verify props
  useEffect(() => {
    console.log(
      "Sidebar - isOpen:",
      isOpen,
      "width:",
      width,
      "isTablet:",
      isTablet
    );
  }, [isOpen, width]);

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggleSidebar}
        />
      )}

      <aside
        className={`bg-gradient-to-b from-emerald-600 to-emerald-800 dark:from-gray-900 dark:to-gray-800 flex flex-col text-white overflow-auto transition-all duration-300 ${
          isMobile
            ? isOpen
              ? "fixed z-50 top-0 left-0 w-52 h-screen"
              : "hidden"
            : isOpen
            ? "block w-64 h-full"
            : "hidden"
        } ${className}`}
      >
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 border-b border-emerald-500/30 px-2 ">
          <span className="text-base sm:text-lg md:text-2xl font-bold  mx-auto">
            CRM
          </span>

          {showChevron && (
            <button
              aria-label="Close sidebar"
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-emerald-100 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 mt-2 sm:mt-3 md:mt-4">
          <ul>
            {[
              { label: "Dashboard", icon: Menu, to: "/" },
              { label: "Contacts", icon: Phone, to: "/contact" },
              { label: "Account", icon: Building, to: "/account" },
              { label: "Task", icon: CheckSquare, to: "/task" },
              { label: "Campaign", icon: Megaphone, to: "/campaign" },
              { label: "Meeting", icon: Calendar, to: "/meeting" },
              { label: "Leads", icon: Calendar, to: "/leads" },
              { label: "Deals", icon: Handshake, to: "/deal" },
            ].map(({ label, icon: Icon, to }) => {
              const active = router.pathname === to;
              return (
                <li
                  key={label}
                  className={`mx-1 sm:mx-2 my-1 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-white/20 backdrop-blur-sm border border-white/10 shadow-lg"
                      : "hover:bg-white/10 hover:backdrop-blur-sm"
                  }`}
                >
                  <div
                    onClick={() => handleItemClick(to)}
                    className={`flex items-center px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 space-x-0 sm:space-x-3 cursor-pointer ${
                      active
                        ? "text-white font-semibold"
                        : "text-emerald-100 dark:text-gray-300"
                    }`}
                  >
                    <Icon className="hidden sm:block w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs sm:text-sm md:text-base">
                      {label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2 sm:p-3 md:p-4 border-t border-emerald-500/30 text-xs sm:text-sm md:text-base text-emerald-100 dark:text-gray-300">
          Support
        </div>
      </aside>
    </>
  );
}
















































