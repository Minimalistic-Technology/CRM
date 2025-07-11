

import React, { useState, useRef, useEffect } from "react";
import { Sliders, Plus, Calendar } from "lucide-react";
import AddNewDeal from "../components/AddNewDeal";

interface Deal {
  id: number;
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

const INITIAL_DEALS: Deal[] = [
  {
    id: 1,
    name: "Acme Renewal",
    company: "Acme Corp",
    stage: "Qualification",
    closeDate: "2025-08-01",
    dealValue: "25000",
  },
  {
    id: 2,
    name: "Globex Expansion",
    company: "Globex Inc",
    stage: "Need Analysis",
    closeDate: "2025-09-15",
    dealValue: "50000",
  },
  {
    id: 3,
    name: "Soylent Upsell",
    company: "Soylent Co",
    stage: "Negotiation",
    closeDate: "2025-10-30",
    dealValue: "75000",
  },
  {
    id: 4,
    name: "Tech Win",
    company: "Tech Ltd",
    stage: "Closed Won",
    closeDate: "2025-11-01",
    dealValue: "100000",
  },
  {
    id: 5,
    name: "Lost Opportunity",
    company: "Lost Inc",
    stage: "Closed Lost",
    closeDate: "2025-11-02",
    dealValue: "30000",
  },
];

const TABS = ["All Deals"] as const;
const STAGES: Stage[] = [
  "Qualification",
  "Need Analysis",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export default function DealPage() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("All Deals");
  const [showActions, setShowActions] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Omit<Deal, "id">>({
    name: "",
    company: "",
    stage: "Qualification",
    closeDate: "",
    dealValue: "",
  });

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
    setEditingId(deal.id);
    setForm({
      name: deal.name,
      company: deal.company,
      stage: deal.stage,
      closeDate: deal.closeDate,
      dealValue: deal.dealValue,
    });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId == null) {
      setDeals((ds) => [...ds, { id: Date.now(), ...form }]);
    } else {
      setDeals((ds) =>
        ds.map((d) => (d.id === editingId ? { id: editingId, ...form } : d))
      );
    }
    setShowForm(false);
    setEditingId(null);
  }

  function handleDeleteSelected() {
    if (selectedCard != null) {
      setDeals((ds) => ds.filter((d) => d.id !== selectedCard));
      setSelectedCard(null);
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
    <div className="p-6 min-h-screen bg-emerald-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Deals
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
        {/* Tabs & Controls */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 rounded-t-2xl dark:bg-gray-800">
          <div className="inline-flex space-x-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap dark:text-white bg-blue-50 ${
                  tab === selectedTab
                    ? "dark:bg-gray-700 text-blue-600 dark:text-white "
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {tab}
                <span className="ml-2 text-blue-600 dark:bg-gray-600 dark:text-white bg-blue-100 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3" ref={actionsRef}>
            <div className="relative">
              <button
                onClick={() => setShowActions((v) => !v)}
                className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-blue-900 hover:bg-blue-800 text-white"
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
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              <Plus className="mr-2" size={16} /> Add New Deal
            </button>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-5 gap-6">
          {STAGES.map((stage, idx) => (
            <div
              key={stage}
              className={`${
                idx > 0 ? "border-l border-gray-200 dark:border-gray-700" : ""
              } p-6`}
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
                    const isSelected = selectedCard === d.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() =>
                          setSelectedCard(isSelected ? null : d.id)
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
                              {d.closeDate}
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

      {/* Modal */}
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
