"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomerDetailsCard from "../../components/CustomerDetailsCard";
import { useCustomerStore } from "../../store";
import { useUserStore } from "../../store";
import { useNotification } from "../../context/NotificationContext";

// Your actual contact shape from backend
interface ContactFromAPI {
  _id: string;
  name: string;
  dob?: string;
  email: string;
  phone: string;
  status?: string;
  lastActivity?: string;
  createdAt?: string;
}

export default function ContactDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { role } = useUserStore();
  const { showNotification } = useNotification();
  const {
    selectedCustomer,
    setSelectedCustomer,
    loading: storeLoading,
    error: storeError,
  } = useCustomerStore();

  // Local fallback state (in case Zustand doesn't have it yet)
  const [contact, setContact] = useState<ContactFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch from your real backend first → then sync to Zustand
  useEffect(() => {
    if (!id) return;

    const fetchContact = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:5000/api/register-contacts/${id}`);
        
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || "Contact not found");
        }

        const data: ContactFromAPI = await res.json();

        // Sync to global Zustand store
        setSelectedCustomer({
          id: data._id,
          name: data.name,
          contact: { email: data.email, phone: data.phone },
          status: data.status || "Active",
          lastActivity: data.lastActivity || data.createdAt || new Date().toISOString(),
          dob: data.dob,
        });

        setContact(data);
        showNotification("Contact loaded successfully", "success");
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: string }).message === "string"
            ? (err as { message: string }).message
            : "Failed to load contact";
        setError(msg);
        showNotification(msg, "error");
        console.error("Contact fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, setSelectedCustomer, showNotification]);

  const handleBack = () => router.push("/contact");
  const handleEdit = () => showNotification("Edit contact coming soon!", "success");
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this contact?")) {
      showNotification("Delete feature coming soon", "success");
    }
  };

  // Show loading
  if (loading || storeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading contact...</p>
        </div>
      </div>
    );
  }

  // Show error
  if (error || storeError || (!contact && !selectedCustomer)) {
    return (
      <div className="p-8 text-center bg-emerald-50 dark:bg-gray-900 min-h-screen">
        <p className="text-xl font-medium text-red-600 dark:text-red-400">
          {error || storeError || "Contact not found"}
        </p>
        <button
          onClick={handleBack}
          className="mt-6 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
        >
          ← Back to Contacts
        </button>
      </div>
    );
  }

  // Use data from Zustand (preferred) or fallback to local
  const customer = selectedCustomer || {
    id: contact?._id || "",
    name: contact?.name || "Unknown",
    contact: { email: contact?.email || "", phone: contact?.phone || "" },
    status: contact?.status || "Active",
    lastActivity: contact?.lastActivity || contact?.createdAt || "",
    dob: contact?.dob,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-emerald-50 dark:bg-gray-900 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
          Contact Details
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleBack}
            className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-medium"
          >
            ← Back to List
          </button>

          {(role === "Admin" || role === "Sales") && (
            <button
              onClick={handleEdit}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition shadow"
            >
              Edit Contact
            </button>
          )}

          {role === "Admin" && (
            <button
              onClick={handleDelete}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition shadow"
            >
              Delete Contact
            </button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Main Details Card */}
        <div className="lg:col-span-2">
          <CustomerDetailsCard customerId={id as string} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Quick Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-blue-900 dark:text-white mb-5">Quick Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  customer.status === "Active" ? "bg-green-100 text-green-800" :
                  customer.status === "Lead" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {customer.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Activity</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {customer.lastActivity
                    ? new Date(customer.lastActivity).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
              {customer.dob && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Birthday</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {new Date(customer.dob).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Zone */}
          {role === "Admin" && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
              <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">Admin Actions</h4>
              <p className="text-sm text-red-700 dark:text-red-400">
                This contact can be permanently deleted.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card (your original beautiful mobile view) */}
      <div className="mt-10 lg:hidden">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-4">
            {customer.name}
          </h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <span>Email:</span> <span className="font-medium">{customer.contact.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Phone:</span> <span className="font-medium">{customer.contact.phone}</span>
            </div>
            {customer.dob && (
              <div className="flex items-center gap-3">
                <span>Birthday:</span> <span className="font-medium">
                  {new Date(customer.dob).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}