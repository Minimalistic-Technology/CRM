// done integeratin search api

"use client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Plus, Sliders } from "lucide-react";

interface Lead {
  _id: string;
  leadOwner: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export default function LeadDetail() {
  const router = useRouter();
  const { id } = router.query; // Extract the dynamic [id] from the URL
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLeadData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/leads/${id}`);
        if (!res.ok) throw new Error("Lead not found");
        const leadData: Lead = await res.json();
        setLead(leadData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch lead data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadData();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!lead) return <div className="p-4">Lead not found</div>;

  return (
    <div className="relative p-4 sm:p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Lead : {lead.firstName} {lead.lastName}
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto" ref={actionsRef}>
            <button
              onClick={() => setShowActions((v) => !v)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-blue-800 bg-blue-900 text-white flex items-center justify-center"
            >
              <Sliders className="mr-2" size={16} /> Actions
            </button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowActions(false);
                    router.push("/leads");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-blue-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700"
                >
                  Back to List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6">
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white text-left">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-semibold">Lead Owner</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">First Name</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Last Name</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 sm:px-6 py-4 text-blue-900 dark:text-white">
                  {lead.leadOwner}
                </td>
                <td className="px-4 sm:px-6 py-4 text-slate-700 dark:text-slate-300">
                  {lead.firstName}
                </td>
                <td className="px-4 sm:px-6 py-4 text-slate-700 dark:text-slate-300">
                  {lead.lastName}
                </td>
                <td className="px-4 sm:px-6 py-4 text-slate-700 dark:text-slate-300">
                  {lead.phone}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
