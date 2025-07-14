"use client";

import React, { useEffect, useState } from "react";
import { Plus, Sliders } from "lucide-react";
import axios from "axios";

interface LeadItem {
  _id: string;
  leadOwner: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<LeadItem, "_id">>({
    leadOwner: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async () => {
    try {
      if (selectedId) {
        const res = await axios.put(`http://localhost:5000/api/leads/${selectedId}`, formData);
        setLeads((prev) => prev.map((lead) => (lead._id === selectedId ? res.data : lead)));
        alert("Lead updated successfully!");
      } else {
        const res = await axios.post("http://localhost:5000/api/leads", formData);
        setLeads((prev) => [...prev, res.data]);
        alert("Lead added successfully!");
      }
      setFormData({ leadOwner: "", firstName: "", lastName: "", phone: "" });
      setShowForm(false);
      setSelectedId(null);
    } catch (err) {
      console.error("Error saving lead", err);
    }
  };

  const handleUpdate = (lead: LeadItem) => {
    setFormData({
      leadOwner: lead.leadOwner,
      firstName: lead.firstName,
      lastName: lead.lastName,
      phone: lead.phone,
    });
    setSelectedId(lead._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await axios.delete(`http://localhost:5000/api/leads/${selectedId}`);
      setLeads((prev) => prev.filter((lead) => lead._id !== selectedId));
      setSelectedId(null);
      setShowActions(false);
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await Promise.all(
        leads.map((lead) => axios.delete(`http://localhost:5000/api/leads/${lead._id}`))
      );
      setLeads([]);
      setSelectedId(null);
      setShowActions(false);
    } catch (err) {
      console.error("Failed to delete all leads", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative p-4 sm:p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Leads
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <button className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white rounded-full font-medium">
            All Leads
            <span className="ml-2 bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {leads.length}
            </span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions((v) => !v);
                }}
                className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-blue-800 bg-blue-900 text-white flex items-center justify-center"
              >
                <Sliders className="mr-2" size={16} /> Actions
              </button>

              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
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
              onClick={() => {
                setShowForm(true);
                setSelectedId(null);
                setFormData({ leadOwner: "", firstName: "", lastName: "", phone: "" });
              }}
              className="flex items-center justify-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 w-full sm:w-auto"
            >
              <Plus className="mr-2" size={16} />
              Add Lead
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white text-left">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-semibold">Lead Owner</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">First Name</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Last Name</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Phone</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No leads available.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 sm:px-6 py-4 text-blue-900 dark:text-white">
                      {lead.leadOwner}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-700 dark:text-slate-300">
                      {lead.firstName}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-700 dark:text-slate-300">
                      {lead.lastName}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-700 dark:text-slate-300">
                      {lead.phone}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdate(lead)}
                          className="px-3 py-1 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(lead._id);
                            handleDelete();
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {selectedId ? "Edit Lead" : "Add Lead"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="leadOwner"
                placeholder="Lead Owner"
                value={formData.leadOwner}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded sm:col-span-2"
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
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded sm:col-span-2"
              />
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedId(null);
                }}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded"
              >
                {selectedId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;

























































