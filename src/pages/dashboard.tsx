"use client";

import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import CustomerDetailsCard from "../components/CustomerDetailsCard";
import { useCustomerStore } from "../store/customerStore";
import { useUserStore } from "../store/userStore";
import { useNotification } from "../context/NotificationContext";
import { Plus, X } from "lucide-react";

// ———————— Types ————————
interface UserProfile {
  fullName: string;
  personal: { email: string };
}
interface DashboardResponse {
  leads: any[];
  meetings: any[];
  tasks: any[];
  deals: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("Guest");
  const [searchTerm, setSearchTerm] = useState("");

  // Add Customer Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Lead" as "Active" | "Inactive" | "Lead",
  });
  const [saving, setSaving] = useState(false);

  // Zustand
  const { customers, fetchCustomers, loading: custLoading, error: custError } = useCustomerStore();
  const { role } = useUserStore();
  const { showNotification } = useNotification();

  // Load user profile
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    fetch("http://localhost:5000/api/crm/user-profiles")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((profiles: UserProfile[]) => {
        const profile = profiles.find(p => p.personal.email === email);
        setFullName(profile?.fullName || "User");
      })
      .catch(() => setFullName("User"));
  }, []);

  // Load dashboard cards
  useEffect(() => {
    fetch("http://localhost:5000/api/crm/dashboard")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setError("Dashboard data error"))
      .finally(() => setLoading(false));
  }, []);

  // Load customers ONCE
  useEffect(() => {
    if (customers.length === 0) {
      fetchCustomers();
    }
  }, []);

  // Search
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contact.phone.includes(searchTerm)
  );

  // Add Customer Handler
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      showNotification("Please fill all fields", "error");
      return;
    }

    setSaving(true);
    const customer = {
      id: String(Date.now()),
      name: newCustomer.name,
      contact: { email: newCustomer.email, phone: newCustomer.phone },
      status: newCustomer.status,
      lastActivity: new Date().toISOString(),
    };

    useCustomerStore.setState(state => ({
      customers: [customer, ...state.customers]
    }));

    setSaving(false);
    setIsAddModalOpen(false);
    setNewCustomer({ name: "", email: "", phone: "", status: "Lead" });
    showNotification(`${customer.name} added successfully!`, "success");
  };

  const { tasks = [], meetings = [], leads = [], deals = [] } = data || {};

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-emerald-50 dark:bg-gray-900 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 dark:text-blue-200">
          Welcome back, {fullName} {role && <span className="text-sm text-gray-600">({role})</span>}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's what's happening in your CRM today.
        </p>
      </div>

      {/* Error */}
      {(error || custError) && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error || custError}
        </div>
      )}

      {/* Customers Section */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <Card title="Customers">
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {custLoading ? (
                <p className="text-center py-12 text-gray-500">Loading customers...</p>
              ) : filteredCustomers.length > 0 ? (
                <Table
                  columns={["Name", "Email", "Phone", "Status"]}
                  data={filteredCustomers.map(c => ({
                    Name: { text: c.name, link: `/contact/${c.id}` },
                    Email: c.contact.email,
                    Phone: c.contact.phone,
                    Status: (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        c.status === "Active" ? "bg-green-100 text-green-800" :
                        c.status === "Lead" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {c.status}
                      </span>
                    )
                  }))}
                />
              ) : (
                <EmptyState message="No customers found" />
              )}

              {/* Add Button */}
              {role === "Admin" && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Customer
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <CustomerDetailsCard />
        </div>
      </section>

      {/* Your original 4 cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Keep your Tasks, Meetings, Leads, Deals cards here */}
      </section>

      {/* ==================== ADD CUSTOMER MODAL ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Add New Customer</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <input
                placeholder="Full Name"
                value={newCustomer.name}
                onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newCustomer.email}
                onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <input
                placeholder="Phone Number"
                value={newCustomer.phone}
                onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <select
                value={newCustomer.status}
                onChange={e => setNewCustomer({ ...newCustomer, status: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Lead">Lead</option>
                <option value="Active">Active Customer</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomer}
                  disabled={saving}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg disabled:opacity-70 transition"
                >
                  {saving ? "Adding..." : "Add Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}