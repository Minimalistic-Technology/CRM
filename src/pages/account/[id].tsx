// done integeratin search api 
"use client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Plus, Sliders } from "lucide-react";

interface Account {
  id: string;
  owner: string;
  name: string;
  number: string;
  website: string;
  type: string;
  revenue: string;
}

export default function AccountDetail() {
  const router = useRouter();
  const { id } = router.query; // Extract the dynamic [id] from the URL
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAccountData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/accounts/${id}`);
        if (!res.ok) throw new Error("Account not found");
        const accountData: Account = await res.json();
        setAccount(accountData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch account data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [id]);

 

  if (loading) return <div className="p-6">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-600 dark:text-red-400">{error}</div>;
  if (!account) return <div className="p-6">Account not found</div>;

  return (
    <div className="relative p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Account : {account.name}
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative" ref={actionsRef}>
            <button
              onClick={() => {
                router.push("/account");
              }}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <div className="overflow-x-auto rounded-xl border dark:border-gray-700 border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white">
              <tr>
                <th className="px-6 py-3 font-semibold text-left">
                  Account Owner
                </th>
                <th className="px-6 py-3 font-semibold text-left">Name</th>
                <th className="px-6 py-3 font-semibold text-left">Number</th>
                <th className="px-6 py-3 font-semibold text-left">Website</th>
                <th className="px-6 py-3 font-semibold text-left">Type</th>
                <th className="px-6 py-3 font-semibold text-left">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-blue-900 dark:text-white">
                  {account.owner}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {account.name}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {account.number}
                </td>
                <td className="px-6 py-4 text-blue-600 dark:text-blue-300 underline">
                  {account.website ? (
                    <a href={account.website} target="_blank" rel="noreferrer">
                      {account.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {account.type}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {account.revenue}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
