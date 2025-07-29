// done search api integeration

"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  owner: string;
  subject: string;
  status: "To Do" | "In Progress" | "Completed";
  due: string;
  priority: "Low" | "Medium" | "High";
}

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/tasks/${id}`);
        if (!res.ok) throw new Error("Task not found");
        const taskData: Task = await res.json();
        setTask(taskData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch task data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-600 dark:text-red-400">{error}</div>;
  if (!task) return <div className="p-6">Task not found</div>;

  return (
    <div className="relative p-6 bg-emerald-50 dark:bg-gray-900 text-blue-900 dark:text-white min-h-screen overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Task : {task.subject}</h1>
        <button
          onClick={() => router.push("/task")}
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-4">
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white">
              <tr className="whitespace-nowrap">
                <th className="px-4 py-3 font-semibold text-left">Owner</th>
                <th className="px-4 py-3 font-semibold text-left">Subject</th>
                <th className="px-4 py-3 font-semibold text-left">Status</th>
                <th className="px-4 py-3 font-semibold text-left">Due</th>
                <th className="px-4 py-3 font-semibold text-left">Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 py-3">{task.owner}</td>
                <td className="px-4 py-3">{task.subject}</td>
                <td className="px-4 py-3">{task.status}</td>
                <td className="px-4 py-3">
                  {new Date(task.due).toISOString().split("T")[0]}
                </td>
                <td className="px-4 py-3">{task.priority}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
