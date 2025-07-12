import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Plus, Sliders } from "lucide-react";
import AddNewcampaign from "../components/AddNewCampaign";

interface campaignData {
  id: string;
  name: string;
  type: string;
  status: string;
  budget: string;
  expectedRevenue: string;
  actualRevenue: string;
  startDate: string;
  endDate: string;
}

interface campaignForm {
  name: string;
  type: string;
  status: string;
  budget: string;
  expectedRevenue: string;
  actualRevenue: string;
  startDate: string;
  endDate: string;
}

export default function Campaign() {
  const [campaigns, setcampaigns] = useState<campaignData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [form, setForm] = useState<campaignForm>({
    name: "",
    type: "Email",
    status: "Planned",
    budget: "",
    expectedRevenue: "",
    actualRevenue: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchcampaigns = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/campaigns");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setcampaigns(
          data.map((item: any) => ({
            id: item._id,
            name: item.name,
            type: item.type,
            status: item.status,
            budget: `$${parseFloat(item.budget || "0").toLocaleString()}`,
            expectedRevenue: `$${parseFloat(
              item.expectedRevenue || "0"
            ).toLocaleString()}`,
            actualRevenue: `$${parseFloat(
              item.actualRevenue || "0"
            ).toLocaleString()}`,
            startDate: new Date(item.startDate).toISOString().split("T")[0],
            endDate: new Date(item.endDate).toISOString().split("T")[0],
          }))
        );
        setError(null);
      } catch (err: any) {
        setError(`Error fetching campaigns: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchcampaigns();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

const handleSave = async (e: FormEvent) => {
  e.preventDefault();

  if (!form.startDate || !form.endDate) {
    setError("Start and end dates are required.");
    return;
  }

  const payload = {
    name: form.name,
    type: form.type,
    status: form.status,
    budget: form.budget,
    expectedRevenue: form.expectedRevenue,
    actualRevenue: form.actualRevenue || "0",
    startDate: new Date(form.startDate).toISOString(),
    endDate: new Date(form.endDate).toISOString(),
    createdBy: "test-user-id",
    updatedBy: "test-user-id", // ✅ this goes to update API
  };

  try {
    let res: Response;

    if (isUpdating && selectedId) {
      res = await fetch(`http://localhost:5000/api/campaigns/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) throw new Error(res.statusText);
    const saved = await res.json();

    // update local state
    const entry: campaignData = {
      id: saved._id,
      name: saved.name,
      type: saved.type,
      status: saved.status,
      budget: `$${parseFloat(saved.budget || "0").toLocaleString()}`,
      expectedRevenue: `$${parseFloat(saved.expectedRevenue || "0").toLocaleString()}`,
      actualRevenue: `$${parseFloat(saved.actualRevenue || "0").toLocaleString()}`,
      startDate: new Date(saved.startDate).toISOString().split("T")[0],
      endDate: new Date(saved.endDate).toISOString().split("T")[0],
    };

    setcampaigns((prev) =>
      isUpdating
        ? prev.map((c) => (c.id === selectedId ? entry : c))
        : [...prev, entry]
    );

    setSuccess(isUpdating ? "Campaign updated!" : "Campaign created!");
    setIsUpdating(false);
    setSelectedId(null);
    setShowForm(false);

    setForm({
      name: "",
      type: "Email",
      status: "Planned",
      budget: "",
      expectedRevenue: "",
      actualRevenue: "",
      startDate: "",
      endDate: "",
    });

    setTimeout(() => setSuccess(null), 3000);
  } catch (err: any) {
    setError(`Error saving campaign: ${err.message}`);
  }
};


  const handleCancel = () => {
    setShowForm(false);
    setIsUpdating(false);
    setSelectedId(null);
    setForm({
      name: "",
      type: "Email",
      status: "Planned",
      budget: "",
      expectedRevenue: "",
      actualRevenue: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/campaigns/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deletedBy : "test-user-id" }),
        }
      );

      if (!res.ok) throw new Error(res.statusText);
      setcampaigns((prev) => prev.filter((c) => c.id !== id));
      if (selectedId === id) setSelectedId(null);
      setSuccess("Deleted successfully!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(`Error deleting: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = (id: string) => {
    const c = campaigns.find((c) => c.id === id);
    if (!c) return;
    setForm({
      name: c.name,
      type: c.type,
      status: c.status,
      budget: (c.budget || "").replace(/[^0-9.]/g, ""),
      expectedRevenue: (c.expectedRevenue || "").replace(/[^0-9.]/g, ""),
      actualRevenue: (c.actualRevenue || "").replace(/[^0-9.]/g, ""),
      startDate: new Date(c.startDate).toISOString().split("T")[0],
      endDate: new Date(c.endDate).toISOString().split("T")[0],
    });
    console.log("Updating campaign:", c);
    setIsUpdating(true);
    setSelectedId(id);
    setShowForm(true);
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const res = await fetch("http://localhost:5000/api/campaigns", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(res.statusText);
      setcampaigns([]);
      setSelectedId(null);
      setSuccess("All deleted!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(`Error deleting all: ${err.message}`);
    } finally {
      setDeleting(false);
      setShowActions(false);
    }
  };

  return (
    <div className="relative p-6 bg-emerald-50 dark:bg-gray-900 text-blue-900 dark:text-white min-h-screen overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <div className="flex flex-col">
          {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
          {success && (
            <p className="text-green-600 dark:text-green-400">{success}</p>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6">
        {/* Top Action Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <button className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 dark:text-white rounded-full font-medium dark:bg-gray-700">
            All campaigns
            <span className="ml-2 bg-blue-100 text-blue-700 dark:text-white dark:bg-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              {campaigns.length}
            </span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Actions Dropdown */}
            <div className="relative">
              <button
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-blue-900 text-white flex items-center hover:bg-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions((v) => !v);
                }}
                disabled={deleting}
              >
                <Sliders className="mr-2" size={16} /> Actions
              </button>
              {showActions && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10"
                  onMouseLeave={() => setShowActions(false)}
                >
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
                    onClick={handleDeleteAll}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete All"}
                  </button>
                </div>
              )}
            </div>

            {/* Add Campaign */}
            <button
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
              onClick={() => {
                setIsUpdating(false);
                handleCancel();
                setShowForm(true);
              }}
              disabled={deleting}
            >
              <Plus className="mr-2" size={16} /> Add New Campaign
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          {loading ? (
            <p className="p-4">Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <p className="p-4">No campaigns found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800 text-sm">
              <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white">
                <tr className="whitespace-nowrap">
                  <th className="px-4 py-3 font-semibold text-left">Name</th>
                  <th className="px-4 py-3 font-semibold text-left">Type</th>
                  <th className="px-4 py-3 font-semibold text-left">Status</th>
                  <th className="px-4 py-3 font-semibold text-left">Budget</th>
                  <th className="px-4 py-3 font-semibold text-left">
                    Expected
                  </th>
                  <th className="px-4 py-3 font-semibold text-left">Actual</th>
                  <th className="px-4 py-3 font-semibold text-left">Start</th>
                  <th className="px-4 py-3 font-semibold text-left">End</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const isSel = c.id === selectedId;
                  const expected = parseFloat(
                    c.expectedRevenue.replace(/[^0-9.]/g, "")
                  );
                  const actual = parseFloat(
                    c.actualRevenue.replace(/[^0-9.]/g, "")
                  );
                  const color =
                    actual > expected + 1000
                      ? "text-green-600 font-semibold"
                      : actual < expected
                      ? "text-red-600 font-semibold"
                      : "text-slate-700 dark:text-slate-300";

                  return (
                    <tr
                      key={c.id}
                      onClick={() =>
                        !deleting && setSelectedId(isSel ? null : c.id)
                      }
                      className={`cursor-pointer border-t border-gray-100 dark:border-gray-700 
                    ${
                      isSel
                        ? "bg-emerald-50 dark:bg-emerald-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${deleting ? "opacity-50" : ""}`}
                    >
                      <td className="px-4 py-3">{c.name}</td>
                      <td className="px-4 py-3">{c.type}</td>
                      <td className="px-4 py-3">{c.status}</td>
                      <td className="px-4 py-3">{c.budget}</td>
                      <td className="px-4 py-3 text-left">
                        {c.expectedRevenue}
                      </td>
                      <td className={`px-4 py-3 text-left ${color}`}>
                        {c.actualRevenue}
                      </td>
                      <td className="px-4 py-3">{c.startDate}</td>
                      <td className="px-4 py-3">{c.endDate}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex space-x-2">
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate(c.id);
                            }}
                            disabled={deleting}
                          >
                            Update
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(c.id);
                            }}
                            disabled={deleting}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AddNewcampaign
              form={form}
              onChange={handleChange}
              onSubmit={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* Backdrop when actions open */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}
