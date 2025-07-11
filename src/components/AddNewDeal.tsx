import React, { ChangeEvent, FormEvent } from "react";

export type Stage =
  | "Qualification"
  | "Need Analysis"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export interface DealForm {
  name: string;
  company: string;
  stage: Stage;
  closeDate: string;
  dealValue: string; // ✅ Added field
}

const STAGES: Stage[] = [
  "Qualification",
  "Need Analysis",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

interface AddNewDealProps {
  form: DealForm;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function AddNewDeal({
  form,
  onChange,
  onSubmit,
  onCancel,
  isEdit = false,
}: AddNewDealProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6"
    >
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Edit Deal" : "Add New Deal"}
      </h2>

      <label className="block mb-3">
        <span className="text-sm text-gray-700">Deal Name</span>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Enter deal name"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm text-gray-700">Company Name</span>
        <input
          name="company"
          value={form.company}
          onChange={onChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Enter company name"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm text-gray-700">Stage</span>
        <select
          name="stage"
          value={form.stage}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-3">
        <span className="text-sm text-gray-700">Close Date</span>
        <input
          type="date"
          name="closeDate"
          value={form.closeDate}
          onChange={onChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </label>

      {/* ✅ Added Deal Value Input */}
      <label className="block mb-4">
        <span className="text-sm text-gray-700">Deal Value</span>
        <input
          type="number"
          name="dealValue"
          value={form.dealValue}
          onChange={onChange}
          required
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Enter deal amount"
        />
      </label>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded text-sm bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm"
        >
          {isEdit ? "Update" : "Add Deal"}
        </button>
      </div>
    </form>
  );
}




















