"use client";

import React, { useState } from "react";
import { Plus, Sliders } from "lucide-react";

interface LeadItem {
  id: number;
  leadOwner: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<LeadItem[]>([
    {
      id: 1,
      leadOwner: "Tech Startup",
      firstName: "Rahul",
      lastName: "Sharma",
      phone: "+91 98765 43210",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<LeadItem, "id">>({
    leadOwner: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.leadOwner && formData.firstName && formData.lastName && formData.phone) {
      const newLead = { ...formData, id: Date.now() };
      setLeads([...leads, newLead]);
      setFormData({ leadOwner: "", firstName: "", lastName: "", phone: "" });
      setShowForm(false);
    }
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      setLeads(leads.filter((lead) => lead.id !== selectedId));
      setSelectedId(null);
    }
    setShowActions(false);
  };

  const handleDeleteAll = () => {
    setLeads([]);
    setSelectedId(null);
    setShowActions(false);
  };

  return (
    <div className="relative p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Leads
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <button className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-gray-700  dark:text-white rounded-full font-medium">
            All Leads
            <span className="ml-2 bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {leads.length}
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions((v) => !v);
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-blue-800 bg-blue-900 text-white flex items-center"
              >
                <Sliders className="mr-2" size={16} /> Actions
              </button>
              {showActions && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10"
                  onMouseLeave={() => setShowActions(false)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    disabled={selectedId == null}
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAll();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Delete All
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(null);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-blue-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700"
                    disabled={selectedId == null}
                  >
                    Deselect
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              <Plus className="mr-2" size={16} />
              Add Lead
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table
            className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Lead Owner</th>
                <th className="px-6 py-3 font-semibold">First Name</th>
                <th className="px-6 py-3 font-semibold">Last Name</th>
                <th className="px-6 py-3 font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No leads available.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const isSelected = lead.id === selectedId;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedId(isSelected ? null : lead.id)}
                      className={`cursor-pointer border-t border-gray-100 dark:border-gray-700 ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-900"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <td className="px-6 py-4 text-blue-900 dark:text-white">
                        {lead.leadOwner}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {lead.firstName}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {lead.lastName}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {lead.phone}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Add Lead
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="leadOwner"
                placeholder="Lead Owner"
                value={formData.leadOwner}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded col-span-2"
              />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded col-span-2"
              />
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-2 rounded col-span-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded col-span-1"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;