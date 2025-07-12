import React, { useState, useRef, useEffect } from "react";
import { Sliders, Plus, CalendarDays } from "lucide-react";
import AddNewTask from "../components/AddNewTask";

interface Task {
  id: number;
  owner: string;
  subject: string;
  status: "To Do" | "In Progress" | "Completed";
  due: string;
  priority: "Low" | "Medium" | "High";
}

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    owner: "Alice",
    subject: "User Onboarding",
    status: "To Do",
    due: "2027-01-08",
    priority: "High",
  },
  {
    id: 2,
    owner: "Bob",
    subject: "Dribbble Prioritisation",
    status: "To Do",
    due: "2027-01-08",
    priority: "Medium",
  },
  {
    id: 3,
    owner: "Carol",
    subject: "WIP Dashboard",
    status: "In Progress",
    due: "2025-01-08",
    priority: "Low",
  },
];

const TABS = ["All Tasks", "To Do", "In Progress", "Completed"] as const;
const STATUSES = ["To Do", "In Progress", "Completed"] as const;

export default function Task() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("All Tasks");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Task, "id">>({
    owner: "",
    subject: "",
    status: "To Do",
    due: "",
    priority: "Medium",
  });
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const [showActions, setShowActions] = useState<boolean>(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(e.target as Node)
      ) {
        setShowActions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const counts = TABS.reduce((acc, tab) => {
    acc[tab] =
      tab === "All Tasks"
        ? tasks.length
        : tasks.filter((t) => t.status === tab).length;
    return acc;
  }, {} as Record<string, number>);

  function handleInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleAdd() {
    setEditingId(null);
    setForm({
      owner: "",
      subject: "",
      status: "To Do",
      due: "",
      priority: "Medium",
    });
    setShowForm(true);
  }

  function handleEditClick(task: Task) {
    setEditingId(task.id);
    setForm({
      owner: task.owner,
      subject: task.subject,
      status: task.status,
      due: task.due,
      priority: task.priority,
    });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId == null) {
      setTasks((ts) => [...ts, { id: Date.now(), ...form }]);
    } else {
      setTasks((ts) =>
        ts.map((t) => (t.id === editingId ? { ...t, ...form } : t))
      );
    }
    setShowForm(false);
  }

  function handleDeleteModal() {
    if (editingId != null) {
      setTasks((ts) => ts.filter((t) => t.id !== editingId));
      setEditingId(null);
      setSelectedCard(null);
    }
    setShowForm(false);
  }

  function handleDeleteSelected() {
    if (selectedCard != null) {
      setTasks((ts) => ts.filter((t) => t.id !== selectedCard));
      setSelectedCard(null);
    }
    setShowActions(false);
  }

  function handleClearAll() {
    setTasks([]);
    setSelectedCard(null);
    setShowActions(false);
  }

  function handleDeselect() {
    setSelectedCard(null);
    setShowActions(false);
  }

  return (
    <div className="p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      {/* Top Bar: Title + Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Tasks
        </h1>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow">
        {/* Tabs + Action Buttons */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
          <div className="inline-flex space-x-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap ${
                  tab === selectedTab
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-800 dark:text-white"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {tab}
                <span className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3"
            ref={actionsRef}
          >
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
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
                        className="w-full text-left px-4 py-2 text-blue-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700"
                        disabled={!selectedCard}
                      >
                        Deselect Card
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleDeleteSelected}
                        className="w-full text-left text-red-600 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900"
                        disabled={!selectedCard}
                      >
                        Delete Selected
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleClearAll}
                        className="w-full text-left text-red-600 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        Clear All
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              <Plus className="mr-2" size={16} /> Add New Task
            </button>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATUSES.map((col, idx) => (
            <div
              key={col}
              className={`p-4 sm:p-6 ${
                idx > 0
                  ? "sm:border-l border-gray-200 dark:border-gray-700"
                  : ""
              }`}
            >
              <h3 className="font-semibold mb-2 flex items-center justify-between text-blue-900 dark:text-white">
                {col}
                <span className="text-sm bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-white rounded-full px-2 py-0.5">
                  {tasks.filter((t) => t.status === col).length}
                </span>
              </h3>

              <div className="space-y-4 mt-4">
                {tasks
                  .filter(
                    (t) =>
                      (selectedTab === "All Tasks" ||
                        t.status === selectedTab) &&
                      t.status === col
                  )
                  .map((t) => {
                    const isSelected = selectedCard === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedCard(t.id)}
                        className={`cursor-pointer rounded-lg shadow p-4 border transition duration-200 ${
                          isSelected
                            ? "bg-emerald-50 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-600"
                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p
                              onClick={() => handleEditClick(t)}
                              className="font-medium text-blue-900 dark:text-white cursor-pointer hover:underline"
                            >
                              {t.subject}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              Owner: {t.owner}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              t.priority === "High"
                                ? "text-red-600"
                                : t.priority === "Medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-300 space-x-4">
                          <span className="flex items-center space-x-1">
                            <CalendarDays size={14} /> <span>{t.due}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center px-4">
          <AddNewTask
            form={form}
            onChange={handleInput}
            onSubmit={handleSubmit}
            onCancel={
              editingId != null ? handleDeleteModal : () => setShowForm(false)
            }
            isEdit={editingId != null}
          />
        </div>
      )}
    </div>
  );
}
