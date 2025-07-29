"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Contact {
  id: number | string;
  name: string;
  dob: string;
  email: string;
  phone: string;
}

export default function ContactDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchContactData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/register-contacts/${id}`
        );
        if (!res.ok) throw new Error("Contact not found");
        const contactData: Contact = await res.json();
        setContact(contactData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch contact data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-600 dark:text-red-400">{error}</div>;
  if (!contact) return <div className="p-4">Contact not found</div>;

  return (
    <div className="relative p-4 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Contact Details
        </h1>
        <button
          onClick={() => router.push("/contact")}
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 hidden md:block">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Contact Name</th>
                <th className="px-6 py-3 font-semibold">Date of Birth</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-blue-900 dark:text-white">
                  {contact.name}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {contact.dob}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {contact.email}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {contact.phone}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900 rounded-lg flex flex-col">
            <div className="mb-2">
              <span className="font-medium text-blue-900 dark:text-white">
                {contact.name}
              </span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <div>
                <span className="font-semibold">DOB:</span> {contact.dob}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {contact.email}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {contact.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










































