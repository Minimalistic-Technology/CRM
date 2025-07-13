
// OG 

// "use client";

// import React, { useState, useEffect } from "react";
// import { RefreshCw, MoreVertical } from "lucide-react";

// // ——— Data interfaces ———
// interface Lead {
//   _id: string;
//   owner: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
// }
// interface Meeting {
//   _id: string;
//   title: string;
//   from?: string; // ISO date string, optional
//   to?: string;   // ISO date string, optional
//   venue?: string;
// }
// interface Task {
//   _id: string;
//   owner: string;
//   subject: string;
//   status: string;
//   due?: string; // ISO date string, optional
//   priority: string;
// }
// interface Deal {
//   _id: string;
//   name: string;
//   company: string;
//   stage: string;
//   closeDate?: string; // ISO date string, optional
//   dealValue: number;
// }

// interface DashboardResponse {
//   leads: Lead[];
//   meetings: Meeting[];
//   tasks: Task[];
//   deals: Deal[];
// }

// // ——— Main Component ———
// export default function Dashboard() {
//   const [data, setData] = useState<DashboardResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/dashboard")
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json() as Promise<DashboardResponse>;
//       })
//       .then((json) => {
//         setData(json);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Failed to load dashboard data");
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-6">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (error || !data) {
//     return (
//       <div className="p-6">
//         <p className="text-red-500">{error || "Unknown error"}</p>
//       </div>
//     );
//   }

//   const {
//     tasks: taskData = [],
//     meetings: meetingData = [],
//     leads: leadData = [],
//     deals: dealData = [],
//   } = data;

//   return (
//     <div className="p-6 space-y-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
//       <h1 className="text-2xl font-bold text-blue-700 dark:text-white">
//         Welcome Vyom
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* — Tasks — */}
//         <Card title="My Open Tasks">
//           {taskData.length > 0 ? (
//             <Table
//               columns={["Owner", "Subject", "Status", "Due Date", "Priority"]}
//               data={taskData.map((t) => ({
//                 Owner: t.owner,
//                 Subject: { text: t.subject, link: false },
//                 Status: t.status,
//                 "Due Date": t.due
//                   ? new Date(t.due).toLocaleDateString()
//                   : "",
//                 Priority: t.priority,
//               }))}
//             />
//           ) : (
//             <EmptyState message="No open tasks" />
//           )}
//         </Card>

//         {/* — Meetings — */}
//         <Card title="My Meetings">
//           {meetingData.length > 0 ? (
//             <Table
//               columns={["Title", "From", "To", "Venue"]}
//               data={meetingData.map((m) => ({
//                 Title: { text: m.title, link: false },
//                 From: m.from ? new Date(m.from).toLocaleString() : "",
//                 To:   m.to   ? new Date(m.to).toLocaleString()   : "",
//                 Venue: m.venue || "",
//               }))}
//             />
//           ) : (
//             <EmptyState message="No upcoming meetings" />
//           )}
//         </Card>

//         {/* — Leads — */}
//         <Card title="Today's Leads">
//           {leadData.length > 0 ? (
//             <Table
//               columns={["Lead Owner", "First name", "Last name", "Phone"]}
//               data={leadData.map((l) => ({
//                 "Lead Owner": l.owner,
//                 "First name": l.firstName,
//                 "Last name": l.lastName,
//                 Phone: l.phone,
//               }))}
//             />
//           ) : (
//             <EmptyState message="No leads for today" />
//           )}
//         </Card>

//         {/* — Deals — */}
//         <Card title="My Deals Closing This Month">
//           {dealData.length > 0 ? (
//             <Table
//               columns={[
//                 "Deal Name",
//                 "company Name",
//                 "Stage",
//                 "Close Date",
//                 "Deal Value",
//               ]}
//               data={dealData.map((d) => ({
//                 "Deal Name":    { text: d.name, link: false },
//                 "company Name": { text: d.company, link: false },
//                 Stage:          d.stage,
//                 "Close Date":   d.closeDate
//                   ? new Date(d.closeDate).toLocaleDateString()
//                   : "",
//                 "Deal Value": d.dealValue  ? `$. ${d.dealValue.toLocaleString()}` : "",
//               }))}
//             />
//           ) : (
//             <EmptyState message="No deals closing this month" />
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// }

// // ——— Inline Card, Table & EmptyState ———

// function Card({
//   title,
//   children,
//   fullWidth = false,
// }: {
//   title: string;
//   children: React.ReactNode;
//   fullWidth?: boolean;
// }) {
//   return (
//     <section
//       className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col ${
//         fullWidth ? "col-span-1 lg:col-span-2" : ""
//       }`}
//     >
//       <header className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-gray-700">
//         <h2 className="text-base font-medium text-gray-800 dark:text-white">
//           {title}
//         </h2>
//         <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
//           <button aria-label="Refresh" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
//             <RefreshCw size={16} />
//           </button>
//           <button aria-label="More actions" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
//             <MoreVertical size={16} />
//           </button>
//         </div>
//       </header>
//       <div className="flex-1 min-h-0">{children}</div>
//     </section>
//   );
// }

// function Table({
//   columns,
//   data,
// }: {
//   columns: string[];
//   data: Array<Record<string, string | { text: string; link: boolean }>>;
// }) {
//   return (
//     <div className="flex flex-col flex-1 overflow-hidden">
//       <div className="overflow-x-auto flex-1">
//         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm mt-2">
//           <thead className="bg-blue-50 dark:bg-gray-700 sticky top-0 z-10">
//             <tr>
//               {columns.map((col) => (
//                 <th
//                   key={col}
//                   className="px-4 py-2 text-left font-medium text-gray-700 dark:text-white uppercase tracking-wide"
//                 >
//                   {col}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//             {data.map((row, idx) => (
//               <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                 {columns.map((col) => {
//                   const cell = row[col];
//                   if (typeof cell === "object" && cell.link) {
//                     return (
//                       <td
//                         key={col}
//                         className="px-4 py-2 whitespace-nowrap text-blue-600 dark:text-blue-300 hover:underline"
//                       >
//                         {cell.text}
//                       </td>
//                     );
//                   }
//                   return (
//                     <td
//                       key={col}
//                       className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-slate-300"
//                     >
//                       {typeof cell === "string" ? cell : cell?.text || ""}
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <footer className="px-4 py-2 flex justify-end items-center text-xs text-gray-500 dark:text-gray-300 space-x-2" />
//     </div>
//   );
// }

// function EmptyState({ message }: { message: string }) {
//   return (
//     <div className="flex-1 flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-300">
//       <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
//       </svg>
//       <span className="text-sm">{message}</span>
//     </div>
//   );
// }























// 

"use client";

import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

interface Lead {
  _id: string;
  owner: string;
  firstName: string;
  lastName: string;
  phone: string;
}
interface Meeting {
  _id: string;
  title: string;
  from?: string;
  to?: string;
  venue?: string;
}
interface Task {
  _id: string;
  owner: string;
  subject: string;
  status: string;
  due?: string;
  priority: string;
}
interface Deal {
  _id: string;
  name: string;
  company: string;
  stage: string;
  closeDate?: string;
  dealValue: number;
}
interface DashboardResponse {
  leads: Lead[];
  meetings: Meeting[];
  tasks: Task[];
  deals: Deal[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<DashboardResponse>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !data)
    return <div className="p-6 text-red-500">{error || "Unknown error"}</div>;

  const { tasks = [], meetings = [], leads = [], deals = [] } = data;

  return (
    <div className="p-6 space-y-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-white">
        Welcome Vyom
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="My Open Tasks">
          {tasks.length > 0 ? (
            <Table
              columns={["Owner", "Subject", "Status", "Due Date", "Priority"]}
              data={tasks.map((t) => ({
                Owner: t.owner,
                Subject: { text: t.subject, link: false },
                Status: t.status,
                "Due Date": t.due
                  ? new Date(t.due).toLocaleDateString()
                  : "",
                Priority: t.priority,
              }))}
            />
          ) : (
            <EmptyState message="No open tasks" />
          )}
        </Card>

        <Card title="My Meetings">
          {meetings.length > 0 ? (
            <Table
              columns={["Title", "From", "To", "Venue"]}
              data={meetings.map((m) => ({
                Title: { text: m.title, link: false },
                From: m.from ? new Date(m.from).toLocaleString() : "",
                To: m.to ? new Date(m.to).toLocaleString() : "",
                Venue: m.venue || "",
              }))}
            />
          ) : (
            <EmptyState message="No upcoming meetings" />
          )}
        </Card>

        <Card title="Today's Leads">
          {leads.length > 0 ? (
            <Table
              columns={["Lead Owner", "First name", "Last name", "Phone"]}
              data={leads.map((l) => ({
                "Lead Owner": l.owner,
                "First name": l.firstName,
                "Last name": l.lastName,
                Phone: l.phone,
              }))}
            />
          ) : (
            <EmptyState message="No leads for today" />
          )}
        </Card>

        <Card title="My Deals Closing This Month">
          {deals.length > 0 ? (
            <Table
              columns={[
                "Deal Name",
                "company Name",
                "Stage",
                "Close Date",
                "Deal Value",
              ]}
              data={deals.map((d) => ({
                "Deal Name": { text: d.name, link: false },
                "company Name": { text: d.company, link: false },
                Stage: d.stage,
                "Close Date": d.closeDate
                  ? new Date(d.closeDate).toLocaleDateString()
                  : "",
                "Deal Value": d.dealValue
                  ? `$. ${d.dealValue.toLocaleString()}`
                  : "",
              }))}
            />
          ) : (
            <EmptyState message="No deals closing this month" />
          )}
        </Card>
      </div>
    </div>
  );
}
