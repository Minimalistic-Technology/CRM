

import React, { useState, useRef, useEffect } from "react";
import { Sliders, Plus, CalendarDays } from "lucide-react";
import AddNewTask from "../components/AddNewTask";

interface Task {
  _id?: string;
  id?: number;
  owner: string;
  subject: string;
  status: "To Do" | "In Progress" | "Completed";
  due: string;
  priority: "Low" | "Medium" | "High";
}

const TABS = ["All Tasks", "To Do", "In Progress", "Completed"] as const;
const STATUSES = ["To Do", "In Progress", "Completed"] as const;

// API functions
const API_BASE_URL = "http://localhost:5000/api/tasks";

const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    const tasks = await response.json();
    return tasks.map((task: any) => ({
      ...task,
      id: task._id, // Map MongoDB _id to id for UI compatibility
      due: new Date(task.due).toISOString().split("T")[0], // Format date for input
      status: task.status === "Pending" ? "To Do" : task.status, // Transform Pending to To Do
    }));
  },

  // Create new task
  createTask: async (task: Omit<Task, "id" | "_id">): Promise<Task> => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        due: new Date(task.due).toISOString(),
      }),
    });
    if (!response.ok) throw new Error("Failed to create task");
    const newTask = await response.json();
    return {
      ...newTask,
      id: newTask._id,
      due: new Date(newTask.due).toISOString().split("T")[0],
    };
  },

  // Update task
  updateTask: async (
    id: string,
    task: Omit<Task, "id" | "_id">
  ): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        due: new Date(task.due).toISOString(),
      }),
    });
    if (!response.ok) throw new Error("Failed to update task");
    const updatedTask = await response.json();
    return {
      ...updatedTask,
      id: updatedTask._id,
      due: new Date(updatedTask.due).toISOString().split("T")[0],
    };
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
  },
};

export default function Task() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("All Tasks");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Task, "id" | "_id">>({
    owner: "",
    subject: "",
    status: "To Do",
    due: "",
    priority: "Medium",
  });
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const [showActions, setShowActions] = useState<boolean>(false);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskApi.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

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
    if (tab === "All Tasks") {
      acc[tab] = tasks.length;
    } else {
      acc[tab] = tasks.filter((t) => t.status === tab).length;
    }
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
    const taskId = task._id || task.id?.toString();
    setEditingId(taskId || null);
    setForm({
      owner: task.owner,
      subject: task.subject,
      status: task.status,
      due: task.due,
      priority: task.priority,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId == null) {
        // Create new task
        const newTask = await taskApi.createTask(form);
        setTasks((ts) => [...ts, newTask]);
      } else {
        // Update existing task
        const updatedTask = await taskApi.updateTask(editingId, form);
        setTasks((ts) =>
          ts.map((t) => {
            const taskId = t._id || t.id?.toString();
            return taskId === editingId ? updatedTask : t;
          })
        );
      }
      setShowForm(false);
    } catch (err) {
      setError("Failed to save task");
      console.error("Error saving task:", err);
    }
  }

  async function handleDeleteModal() {
    if (editingId != null) {
      try {
        await taskApi.deleteTask(editingId);
        setTasks((ts) => {
          return ts.filter((t) => {
            const taskId = t._id || t.id?.toString();
            return taskId !== editingId;
          });
        });
        setEditingId(null);
        setSelectedCard(null);
      } catch (err) {
        setError("Failed to delete task");
        console.error("Error deleting task:", err);
      }
    }
    setShowForm(false);
  }

  async function handleDeleteSelected() {
    if (selectedCard != null) {
      try {
        await taskApi.deleteTask(selectedCard);
        setTasks((ts) => {
          return ts.filter((t) => {
            const taskId = t._id || t.id?.toString();
            return taskId !== selectedCard;
          });
        });
        setSelectedCard(null);
      } catch (err) {
        setError("Failed to delete task");
        console.error("Error deleting task:", err);
      }
    }
    setShowActions(false);
  }

  async function handleClearAll() {
    try {
      // Delete all tasks one by one
      await Promise.all(
        tasks.map(async (task) => {
          const taskId = task._id || task.id?.toString();
          if (taskId) {
            await taskApi.deleteTask(taskId);
          }
        })
      );
      setTasks([]);
      setSelectedCard(null);
    } catch (err) {
      setError("Failed to clear all tasks");
      console.error("Error clearing tasks:", err);
    }
    setShowActions(false);
  }

  function handleDeselect() {
    setSelectedCard(null);
    setShowActions(false);
  }

  if (loading) {
    return (
      <div className="p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-blue-900 dark:text-white">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

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
                    const taskId = t._id || t.id?.toString();
                    const isSelected = selectedCard === taskId;
                    return (
                      <div
                        key={taskId}
                        onClick={() => setSelectedCard(taskId || null)}
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