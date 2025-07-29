import React, { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

interface CampaignForm {
  name: string;
  type: string;
  status: string;
  budget: string;
  expectedRevenue: string;
  actualRevenue: string;
  startDate: string;
  endDate: string;
}

interface AddNewCampaignProps {
  form: CampaignForm;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  isUpdating: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

export default function AddNewCampaign({
  form,
  onChange,
  onSubmit,
  onCancel,
  isUpdating,
  error,
  setError,
}: AddNewCampaignProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {isUpdating ? "Update Campaign" : "Add New Campaign"}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
              >
                <option value="Email">Email</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Webinar">Webinar</option>
                <option value="Telemarketing">Telemarketing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
              >
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget
              </label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
                placeholder="$0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Revenue
              </label>
              <input
                type="number"
                name="expectedRevenue"
                value={form.expectedRevenue}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
                placeholder="$0"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual Revenue
            </label>
            <input
              type="number"
              name="actualRevenue"
              value={form.actualRevenue}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
              placeholder="$0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              {isUpdating ? "Update Campaign" : "Save Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
