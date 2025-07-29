
"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/router";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  /*  
        Sets initial screen width (only uses window if it's defined — avoids SSR issues).

        Defaults to 1200 if window isn't available.

  */
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed to test toggle
  const initialSidebarOpen = useRef<boolean>(false); // Tracks whether the user has manually interacted with the sidebar (to avoid automatic toggling afterward).

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Set initial width and handle resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      // console.log(
      //   "Resize detected, new width:",
      //   newWidth,
      //   "current sidebarOpen:",
      //   sidebarOpen
      // );
      setWidth(newWidth);

      /* 
      REASON :  

          If user never touched the sidebar → system might open it on wide screens.

          🖱️ If user toggled the sidebar → system respects that and closes it only on mobile, where it's assumed the sidebar shouldn't stay open.
      
      */

      // So: If user has not manually toggled, and the screen is changing from mobile → desktop.
      if (!initialSidebarOpen.current && newWidth > 640 && width <= 640) {
        setSidebarOpen(true);
        initialSidebarOpen.current = true;
      }
      // This block automatically closes the sidebar when resizing from large screen to mobile, but only if the user had manually toggled the sidebar before.
      else if (initialSidebarOpen.current && newWidth <= 640 && width > 640) {
        setSidebarOpen(false);
      }
    };
    // JavaScript code that checks if you're running in the browser, not on the server
    if (typeof window !== "undefined") {
      const initialWidth = window.innerWidth;
      setWidth(initialWidth);
      if (initialWidth > 640) {
        setSidebarOpen(true);
        // This line marks that the user or system has already initialized the sidebar's open state, so future automatic toggling (based on screen size) should stop.
        initialSidebarOpen.current = true;
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  /* 
       This defines a function that toggles the sidebar open or closed.

      It’s passed as a prop to both Navbar and Sidebar, so those components can call this when the user clicks a menu or toggle icon.
  */
  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => {
      const newState = !prev;
      return newState;
    });
    /*  It marks that the user manually interacted with the sidebar.

      Once this is true, your resize logic stops auto-opening or closing the sidebar on screen resize.

      Basically: "user is now in control — don’t mess with it automatically."

 */
    initialSidebarOpen.current = true;
  };

  // Route spinner
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
    <div className="flex h-screen">
      <Sidebar
        width={width}
        isOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          width={width}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          className="bg-blue-900"
        />

        <main
          className={`relative flex-1 overflow-auto bg-emerald-50 dark:bg-gray-900 p-6 ${
            sidebarOpen && width <= 640 ? "blur-sm" : ""
          }`}
          onClick={(e) => {
            if (sidebarOpen && width <= 640) e.stopPropagation();
          }}
        >
          {loading && (
            <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}


















