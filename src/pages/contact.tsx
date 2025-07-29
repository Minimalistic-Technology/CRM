"use client"
import React, { useState, useEffect } from "react";
import { Plus, Sliders } from "lucide-react";
import AddContactForm from "../components/AddNewContact";

interface Contact {
  id: string; 
  name: string;
  dob: string;
  email: string;
  phone: string;
}

export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/crm/register-contacts");
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }
      const data = await res.json();
      const formattedData = data.map((contact: { _id: { toString: () => any; }; }) => ({
        ...contact,
        id: contact._id.toString(),
      }));
      console.log("Fetched contacts:", formattedData);
      setContacts(formattedData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    }
  };

  const addContact = async (contact: Omit<Contact, "id">) => {
    try {
      const res = await fetch("http://localhost:5000/api/crm/register-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }
      const newContact = await res.json();
      setContacts([
        ...contacts,
        { ...newContact, id: newContact._id.toString() },
      ]);
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Error adding contact.");
    }
  };

  const updateContact = async (contact: Contact) => {
    try {
      console.log("Updating contact with ID:", contact.id);
      const res = await fetch(
        `http://localhost:5000/api/crm/register-contacts/${contact.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: contact.name,
            dob: contact.dob,
            email: contact.email,
            phone: contact.phone,
          }),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }
      const updatedContact = await res.json();
      setContacts(
        contacts.map((c) =>
          c.id === updatedContact._id.toString()
            ? { ...updatedContact, id: updatedContact._id.toString() }
            : c
        )
      );
      setEditingContact(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Error updating contact.");
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      console.log("Deleting contact with ID:", id);
      const res = await fetch(
        `http://localhost:5000/api/crm/register-contacts/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Error deleting contact.");
    }
  };

  const handleDeleteAllContacts = async () => {
    try {
      if (
        !window.confirm(
          "Are you sure you want to delete all contacts? This action cannot be undone."
        )
      ) {
        return;
      }
      for (const contact of contacts) {
        const res = await fetch(
          `http://localhost:5000/api/register-contacts/${contact.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Server error for contact ${contact.id}:`, errorText);
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${errorText}`
          );
        }
      }
      setContacts([]);
      alert("All contacts deleted successfully.");
    } catch (error) {
      console.error("Error deleting all contacts:", error);
      alert(
        "Error deleting all contacts. Some contacts may not have been deleted."
      );
    }
  };

  const handleUpdateContact = (c: Contact) => {
    setEditingContact(c);
    setShowForm(true);
  };

  return (
    <div className="relative p-4 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Contacts
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
        <div className="mb-4">
          {/* Mobile view: All Contacts header */}
          <div className="flex items-center justify-between md:hidden mb-3">
            <span className="font-medium text-lg text-blue-900 dark:text-white">
              All Contacts
            </span>
            <span className="bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-full">
              {contacts.length}
            </span>
          </div>

          {/* Mobile view: Buttons with stacking and size reduction on small screens */}
          <div className="flex flex-row justify-between md:hidden mb-3 max-[375px]:flex-col max-[375px]:items-center max-[375px]:space-y-2">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 max-[375px]:px-2 max-[375px]:py-1 max-[375px]:w-full max-[375px]:text-sm"
            >
              <Plus
                className="max-[375px]:size-6 max-[375px]:text-xs"
                size={16}
              />
              Add New Contact
            </button>
            <div className="relative max-[375px]:w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions((v) => !v);
                }}
                className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-blue-800 bg-blue-900 text-white max-[375px]:px-2 max-[375px]:py-1 max-[375px]:w-full max-[375px]:text-sm"
              >
                <Sliders
                  className="max-[375px]:size-6 max-[375px]:text-xs max-[375px]:mr-2"
                  size={16}
                />
                Actions
              </button>
              {showActions && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10"
                  onMouseLeave={() => setShowActions(false)}
                >
                  <button
                    onClick={handleDeleteAllContacts}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Delete All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Larger screens: All Contacts and Buttons */}
          <div className="hidden md:flex items-center justify-between">
            <button className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white rounded-full font-medium">
              All Contacts
              <span className="ml-2 bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {contacts.length}
              </span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions((v) => !v);
                  }}
                  className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-blue-800 bg-blue-900 text-white"
                >
                  <Sliders className="" size={16} />
                  Actions
                </button>
                {showActions && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10"
                    onMouseLeave={() => setShowActions(false)}
                  >
                    <button
                      onClick={handleDeleteAllContacts}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      Delete All
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
              >
                <Plus className="" size={16} />
                Add New Contact
              </button>
            </div>
          </div>
        </div>

        {/* TABLE for md+ */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 hidden md:block">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Contact Name</th>
                <th className="px-6 py-3 font-semibold">Date of Birth</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Phone</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No contacts available.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-gray-100 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 text-blue-900 dark:text-white">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {c.dob}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {c.email}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {c.phone}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2 max-[375px]:flex-col max-[375px]:space-x-0 max-[375px]:space-y-2 max-[375px]:items-center">
                        <button
                          onClick={() => handleUpdateContact(c)}
                          className="px-3 py-1 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600 max-[375px]:w-full"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 max-[375px]:w-full"
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

        {/* LIST on sm with stacking on small screens */}
        <div className="space-y-3 md:hidden">
          {contacts.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 py-4">
              No contacts available.
            </div>
          ) : (
            contacts.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-emerald-50 dark:bg-emerald-900 rounded-lg flex flex-col"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-900 dark:text-white">
                    {c.name}
                  </span>
                  <div className="flex space-x-2 max-[375px]:flex-col max-[375px]:space-x-0 max-[375px]:space-y-2 max-[375px]:items-center">
                    <button
                      onClick={() => handleUpdateContact(c)}
                      className="px-3 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600 max-[375px]:w-full"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 max-[375px]:w-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="font-semibold">DOB:</span> {c.dob}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {c.email}
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span> {c.phone}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-30 backdrop-blur-sm flex items-center justify-center px-4">
          <AddContactForm
            onSave={(formData) => {
              if (editingContact) {
                updateContact({ ...formData, id: editingContact.id });
              } else {
                addContact(formData);
              }
              setShowForm(false);
              setEditingContact(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingContact(null);
            }}
            editingContact={editingContact}
          />
        </div>
      )}
    </div>
  );
}