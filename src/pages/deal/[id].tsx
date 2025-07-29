// done search api  integration
"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Deal {
  _id: string;
  name: string;
  company: string;
  stage:
    | "Qualification"
    | "Need Analysis"
    | "Negotiation"
    | "Closed Won"
    | "Closed Lost";
  closeDate: string;
  dealValue: string;
}

export default function DealDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDealData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/deals/${id}`);
        if (!res.ok) throw new Error("Deal not found");
        const dealData: Deal = await res.json();
        setDeal(dealData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch deal data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDealData();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-600 dark:text-red-400">{error}</div>;
  if (!deal) return <div className="p-6">Deal not found</div>;

  return (
    <div className="relative p-6 bg-emerald-50 dark:bg-gray-900 text-blue-900 dark:text-white min-h-screen overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Deal : {deal.name} </h1>
        <button
          onClick={() => router.push("/deal")}
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6">
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white">
              <tr className="whitespace-nowrap">
                <th className="px-4 py-3 font-semibold text-left">Name</th>
                <th className="px-4 py-3 font-semibold text-left">Company</th>
                <th className="px-4 py-3 font-semibold text-left">Stage</th>
                <th className="px-4 py-3 font-semibold text-left">
                  Close Date
                </th>
                <th className="px-4 py-3 font-semibold text-left">
                  Deal Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 py-3">{deal.name}</td>
                <td className="px-4 py-3">{deal.company}</td>
                <td className="px-4 py-3">{deal.stage}</td>
                <td className="px-4 py-3">
                  {new Date(deal.closeDate).toISOString().split("T")[0]}
                </td>
                <td className="px-4 py-3 ">${deal.dealValue}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
