
"use client";
import React from "react";
import { RefreshCw, MoreVertical } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-white">
        Welcome Vyom
      </h1>

      {/* Top grid: 2×2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="My Open Tasks">
          <Table
            columns={["Owner", "Subject", "Status", "Due Date", "Priority"]}
            data={[
              {
                Owner: "",
                Subject: { text: "complete task", link: true },
                Status: "Not Started",
                "Due Date": "27/06/2025",
                Priority: "High",
              },
              {
                Owner: "",
                Subject: { text: "hello", link: true },
                Status: "Not Started",
                "Due Date": "",
                Priority: "High",
              },
            ]}
          />
        </Card>

        <Card title="My Meetings">
          <Table
            columns={["Title", "From", "To", "Venue"]}
            data={[
              {
                Title: { text: "New Meeting", link: true },
                From: "20/06/2025 06:00 PM",
                To: "20/06/2025 07:00 PM",
                Venue: "",
              },
              {
                Title: { text: "New Meeting", link: true },
                From: "20/06/2025 12:00 PM",
                To: "20/06/2025 01:00 PM",
                Venue: "",
              },
            ]}
          />
        </Card>

        <Card title="Today's Leads">
          <Table
            columns={["Lead Owner", "First name", "Last name", "Phone"]}
            data={[
              {
                "Lead Owner": "Vyom",
                "First name": "Alice",
                "Last name": "Johnson",
                Phone: "9876543210",
              },
              {
                "Lead Owner": "Vyom",
                "First name": "Bob",
                "Last name": "Smith",
                Phone: "9123456789",
              },
            ]}
          />
        </Card>

        <Card title="My Deals Closing This Month">
          <Table
            columns={[
              "Deal Name",
              "Company Name",
              "Stage",
              "Close Date",
              "Deal Value",
            ]}
            data={[
              {
                "Deal Name": { text: "deal", link: true },
                "Company Name": { text: "Jack", link: true },
                Stage: "Closed Lost to Competition",
                "Close Date": "21/06/2025",
                "Deal Value": "Rs. 6,700",
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

// Card component: wrapper with header and body
function Card({
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
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
          <button
            aria-label="Refresh"
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
          >
            <RefreshCw size={16} />
          </button>
          <button
            aria-label="More actions"
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </header>
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  );
}

// Table component: sticky header + scroll + pagination
function Table({
  columns,
  data,
}: {
  columns: string[];
  data: Array<Record<string, string | { text: string; link: boolean }>>;
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm mt-2">
          <thead className="bg-blue-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left font-medium text-gray-700 dark:text-white uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {columns.map((col) => {
                  const cell = row[col];
                  if (typeof cell === "object" && cell.link) {
                    return (
                      <td
                        key={col}
                        className="px-4 py-2 whitespace-nowrap text-blue-600 dark:text-blue-300 hover:underline"
                      >
                        {cell.text}
                      </td>
                    );
                  }
                  return (
                    <td
                      key={col}
                      className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-slate-300"
                    >
                      {typeof cell === "string" ? cell : cell?.text || ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="px-4 py-2 flex justify-end items-center text-xs text-gray-500 dark:text-gray-300 space-x-2"></footer>
    </div>
  );
}

// EmptyState: when a card has no data
function EmptyState({ message }: { message: string }) {
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