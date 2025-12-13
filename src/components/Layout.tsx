"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/router";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import Notification from "./Notification";
import { NotificationProvider } from "../context/NotificationContext";
import { useUserStore } from "../store"; // ← Added: Access user role globally

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initialSidebarOpen = useRef<boolean>(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ← Added: Get user role for role-based rendering later
  const { role } = useUserStore();

  // Resize & smart sidebar behavior (your excellent logic — kept 100%)
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);

      if (!initialSidebarOpen.current && newWidth > 640 && width <= 640) {
        setSidebarOpen(true);
        initialSidebarOpen.current = true;
      } else if (initialSidebarOpen.current && newWidth <= 640 && width > 640) {
        setSidebarOpen(false);
      }
    };

    if (typeof window !== "undefined") {
      const initialWidth = window.innerWidth;
      setWidth(initialWidth);
      if (initialWidth > 640) {
        setSidebarOpen(true);
        initialSidebarOpen.current = true;
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    initialSidebarOpen.current = true; // User took control
  };

  // Route change loading spinner
  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router]);

  return (
    <NotificationProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar
          width={width}
          isOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Navbar
            width={width}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            className="bg-blue-900"
          />

          <main
            className={`relative flex-1 overflow-auto bg-emerald-50 dark:bg-gray-900 p-6 transition-all duration-300 ${
              sidebarOpen && width <= 640 ? "blur-sm pointer-events-none" : ""
            }`}
            tabIndex={-1}
            aria-label="Main content"
            // Close sidebar when clicking on main content (mobile only)
            onClick={() => width <= 640 && sidebarOpen && setSidebarOpen(false)}
          >
            {/* Route Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 z-50 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 flex items-center justify-center">
                <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Page Content */}
            {children}
          </main>
        </div>

        {/* Global Toast Notification */}
        <Notification />
      </div>
    </NotificationProvider>
  );
}