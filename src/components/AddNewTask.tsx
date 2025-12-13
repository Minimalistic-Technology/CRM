
import React, { ChangeEvent, FormEvent } from "react";

const STATUSES = ["To Do", "In Progress", "Completed"] as const;
const PRIORITIES = ["High", "Medium", "Low"] as const;

type Status = (typeof STATUSES)[number];
type Priority = (typeof PRIORITIES)[number];

interface TaskFormData {
  owner: string;
  subject: string;
  status: Status;
  due: string;
  priority: Priority;
}

interface AddNewTaskProps {
  form: TaskFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function AddNewTask({
  form,
  onChange,
  onSubmit,
  onCancel,
  isEdit = false,
}: AddNewTaskProps) {
  const getPriorityTextColor = (priority: Priority): string => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-700";
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-xl shadow-lg w-full max-w-sm p-4"
    >
      <h2 className="text-lg font-semibold mb-3">
        {isEdit ? "Edit Task" : "Add New Task"}
      </h2>

      <label className="block mb-3">
        <span className="text-sm text-gray-700">Task Owner</span>
        <input
          name="owner"
          value={form.owner}
          onChange={onChange}
          required
          autoComplete="off"
          className="mt-1 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
          placeholder="Enter owner name"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm text-gray-700">Subject</span>
        <input
          name="subject"
          value={form.subject}
          onChange={onChange}
          required
          autoComplete="off"
          className="mt-1 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
          placeholder="Enter subject"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm text-gray-700">Status</span>
        <select
          name="status"
          value={form.status}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-3">
        <span className="text-sm text-gray-700">Due Date</span>
        <input
          type="date"
          name="due"
          value={form.due}
          onChange={onChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm text-gray-700">Priority</span>
        <select
          name="priority"
          value={form.priority}
          onChange={onChange}
          className={`mt-1 block w-full border border-gray-300 rounded-md p-1.5 text-sm ${getPriorityTextColor(
            form.priority
          )}`}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p} className={getPriorityTextColor(p)}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className={`px-3 py-1.5 rounded text-sm text-white ${
            isEdit
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-300 hover:bg-gray-400 text-gray-800"
          }`}
        >
          {isEdit ? "Delete" : "Cancel"}
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded"
        >
          Add
        </button>
      </div>
    </form>
  );
}
