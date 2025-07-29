import React from "react";
import { RefreshCw, MoreVertical } from "lucide-react";

export default function Card({
  title,
  children,
  fullWidth = false,
}: {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <section
      className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col ${
        fullWidth ? "col-span-1 lg:col-span-2" : ""
      }`}
    >
      <header className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-gray-700">
        <h2 className="text-base font-medium text-gray-800 dark:text-white">
          {title}
        </h2>
        
      </header>
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  );
}
