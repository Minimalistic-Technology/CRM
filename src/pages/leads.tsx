"use client";
import React, { useEffect, useState, useRef } from "react";
import { Plus, Sliders } from "lucide-react";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Omit<LeadItem, "_id">>({
    leadOwner: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(e.target as Node)
      ) {
        setShowActions(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/crm/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  const validateForm = () => {
    if (!formData.leadOwner.trim()) return "Lead Owner is required";
    if (!formData.firstName.trim()) return "First Name is required";
    if (!formData.lastName.trim()) return "Last Name is required";
    if (!formData.phone.trim()) return "Phone is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);

    const basePayload = { ...formData };
    const payload =
      editingId == null ? { ...basePayload, owner: "global" } : basePayload;

    try {
      let res;
      if (editingId == null) {
        res = await fetch("http://localhost:5000/api/crm/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`http://localhost:5000/api/crm/leads/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error(
          "Error saving lead:",
          errorData?.error || "Unknown error"
        );
      } else {
        // const saved = await res.json();
      }

      if (editingId == null) {
        try {
          await fetch("http://localhost:5000/api/crm/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: "global",
              message: `Lead "${formData.firstName} ${formData.lastName}" created.`,
              type: "lead",
            }),
          });
        } catch (notificationErr) {
          console.error("Failed to create notification:", notificationErr);
        }
      }
    } catch (err) {
      console.error("Error saving lead:", err);
    } finally {
      await fetchLeads();
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({ leadOwner: "", firstName: "", lastName: "", phone: "" });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ leadOwner: "", firstName: "", lastName: "", phone: "" });
    setShowForm(true);
    setFormError(null);
  };

  const openEditForm = (lead: LeadItem) => {
    setEditingId(lead._id);
    setFormData({
      leadOwner: lead.leadOwner,
      firstName: lead.firstName,
      lastName: lead.lastName,
      phone: lead.phone,
    });
    setShowForm(true);
    setFormError(null);
  };

  const handleDeleteSelected = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/crm/leads/${selectedId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting lead:", errorData?.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error deleting lead:", err);
    } finally {
      await fetchLeads();
    }

    setShowActions(false);
  };

  const handleClearAll = () => {
    setLeads([]);
    setSelectedId(null);
    setShowActions(false);
  };

  const handleDeselect = () => {
    setSelectedId(null);
    setShowActions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(null);
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
            <div className="relative w-full sm:w-auto" ref={actionsRef}>
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
                      if (selectedId) handleDeleteSelected();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    disabled={selectedId == null}
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearAll();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Delete All
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeselect();
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
              onClick={openAddForm}
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
                          onClick={() => openEditForm(lead)}
                          className="px-3 py-1 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(lead._id);
                            handleDeleteSelected();
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
              {editingId ? "Edit Lead" : "Add Lead"}
            </h3>
            {formError && (
              <p className="text-sm text-red-500 dark:text-red-400 mb-4">
                {formError}
              </p>
            )}
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
                  setEditingId(null);
                  setFormError(null);
                }}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded"
              >
                {editingId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;