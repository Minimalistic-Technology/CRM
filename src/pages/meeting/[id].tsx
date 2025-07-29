// code working before backend blunder

"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface MeetingItem {
  _id: string;
  name: string;
  venue: string;
  from: string;
  to: string;
}

export default function MeetingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [meeting, setMeeting] = useState<MeetingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMeetingData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/meetings/${id}`);
        if (!res.ok) throw new Error("Meeting not found");
        const meetingData: MeetingItem = await res.json();
        setMeeting(meetingData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch meeting data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingData();
  }, [id]);

  if (loading) return <div className="p-4 sm:p-6">Loading...</div>;
  if (error)
    return (
      <div className="p-4 sm:p-6 text-red-600 dark:text-red-400">{error}</div>
    );
  if (!meeting) return <div className="p-4 sm:p-6">Meeting not found</div>;

  return (
    <div className="relative p-4 sm:p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Meeting : {meeting.name}
        </h1>
        <button
          onClick={() => router.push("/meeting")}
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6">
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white text-left">
              <tr>
                <th className="px-4 py-4 font-semibold">Meeting Name</th>
                <th className="px-4 py-4 font-semibold">Meeting Venue</th>
                <th className="px-4 py-4 font-semibold">From</th>
                <th className="px-4 py-4 font-semibold">To</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 py-4 text-blue-900 dark:text-white">
                  {meeting.name}
                </td>
                <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                  {meeting.venue}
                </td>
                <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                  {new Date(meeting.from).toISOString().split("T")[0]}
                </td>
                <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                  {new Date(meeting.to).toISOString().split("T")[0]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}












