

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Account {
  id: number | string;
  owner: string;
  name: string;
  number: string;
  website: string;
  type: string;
  revenue: string;
}

interface AddNewAccountProps {
  onSave: (account: Omit<Account, "id">) => void;
  onCancel: () => void;
  editingAccount: Account | null;
}

export default function AddNewAccount({
  onSave,
  onCancel,
  editingAccount,
}: AddNewAccountProps) {
  const [form, setForm] = useState<Omit<Account, "id">>({
    owner: "",
    name: "",
    number: "",
    website: "",
    type: "Customer",
    revenue: "",
  });

  useEffect(() => {
    if (editingAccount) {
      setForm({
        owner: editingAccount.owner,
        name: editingAccount.name,
        number: editingAccount.number,
        website: editingAccount.website,
        type: editingAccount.type,
        revenue: editingAccount.revenue,
      });
    } else {
      setForm({
        owner: "",
        name: "",
        number: "",
        website: "",
        type: "Customer",
        revenue: "",
      });
    }
  }, [editingAccount]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingAccount ? "Edit Account" : "Add New Account"}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          {/* <X size={20} className="text-gray-500" /> */}
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Account Owner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Owner
          </label>
          <input
            type="text"
            name="owner"
            value={form.owner}
            onChange={handleChange}
            placeholder="Enter owner name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Account Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter account name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Number & Website */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="number"
              value={form.number}
              onChange={handleChange}
              placeholder="e.g. ACC-1234"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Type & Annual Revenue */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="Customer">Customer</option>
              <option value="Partner">Partner</option>
              <option value="Vendor">Vendor</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Revenue
            </label>
            <input
              type="text"
              name="revenue"
              value={form.revenue}
              onChange={handleChange}
              placeholder="$0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors text-sm font-medium"
          >
            {editingAccount ? "Save Changes" : "Save Account"}
          </button>
        </div>
      </form>
    </div>
  );
}