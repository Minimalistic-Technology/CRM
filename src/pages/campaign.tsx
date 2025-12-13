"use client"
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Plus, Sliders } from "lucide-react";
import AddNewCampaign from "../components/AddNewCampaign";

interface CampaignData {
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

export default function Campaign() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [form, setForm] = useState<CampaignForm>({
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
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/crm/campaigns");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setCampaigns(
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
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(`Error fetching campaigns: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f: CampaignForm) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate) {
      setError("Start and end dates are required.");
      return;
    }

    interface Payload extends CampaignForm {
      createdBy?: string;
      updatedBy?: string;
    }

    const payload: Payload = {
      name: String(form.name),
      type: String(form.type),
      status: String(form.status),
      budget: String(form.budget),
      expectedRevenue: String(form.expectedRevenue),
      actualRevenue: String(form.actualRevenue || "0"),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };

    if (isUpdating) {
      payload.updatedBy = "manan";
    } else {
      payload.createdBy = "global";
    }

    if (!form.startDate || isNaN(Date.parse(form.startDate))) {
      setError("Start date is invalid");
      return;
    }
    if (!form.endDate || isNaN(Date.parse(form.endDate))) {
      setError("End date is invalid");
      return;
    }

    try {
      let res: Response;

      if (isUpdating && selectedId) {
        res = await fetch(
          `http://localhost:5000/api/crm/campaigns/${selectedId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch("http://localhost:5000/api/crm/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData.message || errorData.error || "Bad Request";
        throw new Error(errorMessage);
      }

      const saved = await res.json();
      const entry: CampaignData = {
        id: saved._id,
        name: saved.name,
        type: saved.type,
        status: saved.status,
        budget: `$${parseFloat(saved.budget || "0").toLocaleString()}`,
        expectedRevenue: `$${parseFloat(
          saved.expectedRevenue || "0"
        ).toLocaleString()}`,
        actualRevenue: `$${parseFloat(
          saved.actualRevenue || "0"
        ).toLocaleString()}`,
        startDate: new Date(saved.startDate).toISOString().split("T")[0],
        endDate: new Date(saved.endDate).toISOString().split("T")[0],
      };

      setCampaigns((prev) =>
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Error saving campaign: ${errorMessage}`);
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
    setError(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/crm/campaigns/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deletedBy: "manan" }),
      });

      if (!res.ok) throw new Error(res.statusText);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      if (selectedId === id) setSelectedId(null);
      setSuccess("Deleted successfully!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Error deleting: ${errorMessage}`);
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
      budget: c.budget.replace("$", "").replace(",", ""),
      expectedRevenue: c.expectedRevenue.replace("$", "").replace(",", ""),
      actualRevenue: c.actualRevenue.replace("$", "").replace(",", ""),
      startDate: c.startDate,
      endDate: c.endDate,
    });
    setIsUpdating(true);
    setSelectedId(id);
    setShowForm(true);
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const res = await fetch("http://localhost:5000/api/crm", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(res.statusText);
      setCampaigns([]);
      setSelectedId(null);
      setSuccess("All deleted!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Error deleting all: ${errorMessage}`);
    } finally {
      setDeleting(false);
      setShowActions(false);
    }
  };

  return (
    <div className="relative p-6 bg-emerald-50 dark:bg-gray-900 text-blue-900 dark:text-white min-h-screen overflow-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <div className="flex flex-col">
          {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
          {success && (
            <p className="text-green-600 dark:text-green-400">{success}</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <button className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 dark:text-white rounded-full font-medium dark:bg-gray-700">
            All campaigns
            <span className="ml-2 bg-blue-100 text-blue-700 dark:text-white dark:bg-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              {campaigns.length}
            </span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
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

      {showForm && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AddNewCampaign
              form={form}
              onChange={handleChange}
              onSubmit={handleSave}
              onCancel={handleCancel}
              isUpdating={isUpdating}
              error={error}
              setError={setError}
            />
          </div>
        </div>
      )}

      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}
