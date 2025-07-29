// done search functionality inegration

"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface CampaignData {
  id: string;
  name: string;
  type: string;
  status: string;
  budget: string;
  expectedRevenue: string;
  actualRevenue: string;
  startDate: string;
  endDate: string;
}

export default function CampaignDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/campaigns/${id}`);
        if (!res.ok) throw new Error("Campaign not found");
        const campaignData: CampaignData = await res.json();
        setCampaign(campaignData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch campaign data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-600 dark:text-red-400">{error}</div>;
  if (!campaign) return <div className="p-6">Campaign not found</div>;

  const expected = parseFloat(campaign.expectedRevenue.replace(/[^0-9.]/g, ""));
  const actual = parseFloat(campaign.actualRevenue.replace(/[^0-9.]/g, ""));
  const revenueClass =
    actual > expected + 1000
      ? "text-green-600 font-semibold"
      : actual < expected
      ? "text-red-600 font-semibold"
      : "text-slate-700 dark:text-slate-300";

  return (
    <div className="relative p-6 bg-emerald-50 dark:bg-gray-900 text-blue-900 dark:text-white min-h-screen overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Campaign : {campaign.name}</h1>
        <button
          onClick={() => router.push("/campaign")}
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
                <th className="px-4 py-3 font-semibold text-left">Type</th>
                <th className="px-4 py-3 font-semibold text-left">Status</th>
                <th className="px-4 py-3 font-semibold text-left">Budget</th>
                <th className="px-4 py-3 font-semibold text-left">Expected</th>
                <th className="px-4 py-3 font-semibold text-left">Actual</th>
                <th className="px-4 py-3 font-semibold text-left">Start</th>
                <th className="px-4 py-3 font-semibold text-left">End</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 py-3">{campaign.name}</td>
                <td className="px-4 py-3">{campaign.type}</td>
                <td className="px-4 py-3">{campaign.status}</td>
                <td className="px-4 py-3">${campaign.budget}</td>
                <td className="px-4 py-3 text-left">
                  ${campaign.expectedRevenue}
                </td>
                <td className={`px-4 py-3 text-left ${revenueClass}`}>
                  ${campaign.actualRevenue}
                </td>
                <td className="px-4 py-3">
                  {new Date(campaign.startDate).toISOString().split("T")[0]}
                </td>
                <td className="px-4 py-3">
                  {new Date(campaign.endDate).toISOString().split("T")[0]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
