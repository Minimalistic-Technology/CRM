import React from "react";

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-300">
      <svg
        className="w-12 h-12 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7h18M3 12h18M3 17h18"
        />
      </svg>
      <span className="text-sm">{message}</span>
    </div>
  );
}
