"use client";

import React, {  } from "react";
import { useRouter } from "next/router";
import {
  Menu, Phone, CheckSquare, Megaphone,
  CalendarClock, Building, Handshake,
  UserPlus, ChevronLeft
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
  const router = useRouter();

  const isMobile = width <= 640;
  const showOverlay = isMobile && isOpen;

  const menuItems = [
    { label: "Dashboard", icon: Menu, href: "/dashboard" },
    { label: "Contacts", icon: Phone, href: "/contact" },
    { label: "Accounts", icon: Building, href: "/account" },
    { label: "Tasks", icon: CheckSquare, href: "/task" },
    { label: "Campaigns", icon: Megaphone, href: "/campaign" },
    { label: "Meetings", icon: CalendarClock, href: "/meeting" },
    { label: "Leads", icon: UserPlus, href: "/leads" },
    { label: "Deals", icon: Handshake, href: "/deal" },
  ];

  return (
    <>
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggleSidebar}
        />
      )}

      <aside className={`fixed md:relative z-50 h-screen bg-gradient-to-b from-emerald-700 to-emerald-900 text-white transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } ${isMobile ? "w-64" : "w-64"} ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-emerald-600">
          <h1 className="text-2xl font-bold">CRM</h1>
          {(isMobile || width <= 1024) && isOpen && (
            <button
              onClick={onToggleSidebar}
              title="Close sidebar"
              aria-label="Close sidebar"
              className="p-2 hover:bg-white/10 rounded"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(({ label, icon: Icon, href }) => {
            const active = router.pathname === href;
            return (
              <button
                key={label}
                onClick={() => {
                  router.push(href);
                  if (isMobile) onToggleSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-white/20 shadow-lg font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}