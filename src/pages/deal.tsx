import React, { useState, useRef, useEffect } from "react";
import { Sliders, Plus, Calendar } from "lucide-react";
import AddNewDeal from "../components/AddNewDeal";

interface Deal {
  _id: string;
  name: string;
  company: string;
  stage: Stage;
  closeDate: string;
  dealValue: string;
}

type Stage =
  | "Qualification"
  | "Need Analysis"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

const TABS = ["All Deals"] as const;
const STAGES: Stage[] = [
  "Qualification",
  "Need Analysis",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export default function deal() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("All Deals");
  const [showActions, setShowActions] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Omit<Deal, "_id">>({
    name: "",
    company: "",
    stage: "Qualification",
    closeDate: "",
    dealValue: "",
  });

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch("http://localhost:5000/api/deals");
        const data = await res.json();
        setDeals(data);
      } catch (err) {
        console.error("Failed to fetch deals", err);
      }
    }

    fetchDeals();
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

  const counts = { "All Deals": deals.length };

  function handleInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm({
      name: "",
      company: "",
      stage: "Qualification",
      closeDate: "",
      dealValue: "",
    });
    setShowForm(true);
  }

  function openEditForm(deal: Deal) {
    setEditingId(deal._id);
    setForm({
      name: deal.name,
      company: deal.company,
      stage: deal.stage,
      closeDate: deal.closeDate.split("T")[0],
      dealValue: String(deal.dealValue),
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      dealValue: parseFloat(form.dealValue),
      closeDate: new Date(form.closeDate).toISOString(),
      owner: "test-user-id",
    };

    try {
      let res;
      if (editingId == null) {
        res = await fetch("http://localhost:5000/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`http://localhost:5000/api/deals/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to save deal");
      }
      const saved = await res.json(); 

      setDeals((prev) =>
        editingId == null
          ? [...prev, saved]
          : prev.map((d) => (d._id === saved._id ? saved : d))
      );
    } catch (err) {
      console.error("Error saving deal", err);
    }

    setShowForm(false);
    setEditingId(null);
  }

  async function handleDeleteSelected() {
    if (!selectedCard) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/deals/${selectedCard}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to delete deal");
      }

      setDeals((prev) => prev.filter((d) => d._id !== selectedCard));
      setSelectedCard(null);
    } catch (err) {
      console.error("Error deleting deal", err);
    }

    setShowActions(false);
  }

  function handleClearAll() {
    setDeals([]);
    setSelectedCard(null);
    setShowActions(false);
  }

  function handleDeselect() {
    setSelectedCard(null);
    setShowActions(false);
  }

  function formatCurrency(value: string) {
    const num = parseFloat(value);
    return isNaN(num)
      ? "$0"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(num);
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-emerald-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Deals
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl dark:bg-gray-800">
          <div className="flex overflow-x-auto no-scrollbar space-x-2 w-full sm:w-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition ${
                  tab === selectedTab
                    ? "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-white"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {tab}
                <span className="ml-2 bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto"
            ref={actionsRef}
          >
            <div className="relative">
              <button
                onClick={() => setShowActions((v) => !v)}
                className="flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-blue-900 hover:bg-blue-800 text-white w-full sm:w-auto"
              >
                <Sliders className="mr-2" size={16} /> Actions
              </button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={handleDeselect}
                        className="w-full text-left px-4 py-2 text-blue-900 dark:text-blue-100 hover:bg-blue-50 dark:hover:bg-gray-700"
                        disabled={!selectedCard}
                      >
                        Deselect Card
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleDeleteSelected}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                        disabled={!selectedCard}
                      >
                        Delete Selected
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleClearAll}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        Clear All
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={openAddForm}
              className="flex items-center justify-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 w-full sm:w-auto"
            >
              <Plus className="mr-2" size={16} /> Add New Deal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 sm:p-6">
          {STAGES.map((stage, idx) => (
            <div
              key={stage}
              className={`${
                idx > 0
                  ? "sm:border-l border-gray-200 dark:border-gray-700"
                  : ""
              }`}
            >
              <h3 className="font-semibold mb-2 flex items-center justify-between text-blue-900 dark:text-white">
                {stage}
                <span className="text-sm text-blue-600 dark:text-blue-300 rounded-full px-2 py-0.5">
                  {deals.filter((d) => d.stage === stage).length}
                </span>
              </h3>
              <div className="space-y-4 mt-4">
                {deals
                  .filter(
                    (d) =>
                      (selectedTab === "All Deals" ||
                        d.stage === selectedTab) &&
                      d.stage === stage
                  )
                  .map((d) => {
                    const isSelected = selectedCard === d._id;
                    return (
                      <div
                        key={d._id}
                        onClick={() =>
                          setSelectedCard(isSelected ? null : d._id)
                        }
                        className={`cursor-pointer rounded-lg shadow p-4 border transition-colors ${
                          isSelected
                            ? "bg-emerald-50 dark:bg-emerald-900 border-emerald-300"
                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="w-full">
                            <p
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditForm(d);
                              }}
                              className="font-medium text-blue-900 dark:text-white cursor-pointer hover:underline mb-1"
                            >
                              {d.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {d.company}
                            </p>
                            <div className="flex items-center text-emerald-600 font-semibold mb-2">
                              {formatCurrency(d.dealValue)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar size={14} className="mr-1" />
                              {d.closeDate.split("T")[0]}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <AddNewDeal
            form={form}
            onChange={handleInput}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
            }}
            isEdit={editingId != null}
          />
        </div>
      )}
    </div>
  );
}
