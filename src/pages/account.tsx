"use client";
import React, { useState, useEffect } from "react";
import { Plus, Sliders } from "lucide-react";
import AddNewAccount from "../components/AddNewAccount";

interface Account {
  id: string;
  owner: string;
  name: string;
  number: string;
  website: string;
  type: string;
  revenue: string;
}

export default function Account() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [previousRevenue, setPreviousRevenue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getNumericRevenue = (value: string): number => {
    const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/crm/accounts");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const mappedAccounts = data.map((item: any) => ({
        id: String(item._id || item.id),
        owner: item.owner || "",
        name: item.name || "",
        number: item.number || "",
        website: item.website || "",
        type: item.type || "Customer",
        revenue: formatRevenue(item.revenue || "0"),
      }));
      setAccounts(mappedAccounts);
    } catch (err: any) {
      console.error("Fetch accounts error:", err.message);
      setAccounts([]);
      setError(`Failed to fetch accounts: ${err.message}`);
      setTimeout(() => setError(null), 5000);
    }
  };

  const formatRevenue = (value: string | number): string => {
    try {
      const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, ""));
      return isNaN(numericValue) ? "$0" : `$${numericValue.toLocaleString()}`;
    } catch {
      return "$0";
    }
  };

 const handleSave = async (newAccount: Omit<Account, "id">) => {
   try {
     let res;
     if (editingAccount) {
       // Ensure all required fields are included
       const updatedData = {
         ...newAccount,
         owner: newAccount.owner || editingAccount.owner,
         name: newAccount.name || editingAccount.name,
         number: newAccount.number || editingAccount.number,
         website: newAccount.website || editingAccount.website,
         type: newAccount.type || editingAccount.type,
         revenue: newAccount.revenue || editingAccount.revenue, // Ensure revenue is sent
       };
       console.log("Updated Data:", updatedData);
       res = await fetch(
         `http://localhost:5000/api/crm/accounts/${editingAccount.id}`,
         {
           method: "PUT",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(updatedData),
         }
       );
     } else {
       res = await fetch("http://localhost:5000/api/crm/accounts", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(newAccount),
       });
     }
     const responseData = await res.json();
   

     console.log("API Response:", responseData); // Debug log

     // Extract revenue from response or fallback to edited value by form 
     const apiRevenue = responseData.revenue || newAccount.revenue || "0";

     // Create revenue change notification if applicable
     if (editingAccount && previousRevenue !== null) {
       const newRevenueNum = getNumericRevenue(apiRevenue);
       if (previousRevenue !== newRevenueNum) {
         await fetch("http://localhost:5000/api/crm/notifications", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             userId: "global",
             message: `Revenue Field value changed from $${previousRevenue.toLocaleString()} to $${newRevenueNum.toLocaleString()}`,
             type: "account",
           }),
         });
       }
     }

     // Update accounts with the new data
     const updatedAccountData = {
       id: String(
         responseData._id ||
           responseData.id ||
           (editingAccount ? editingAccount.id : responseData.data?._id)
       ),
       owner: responseData.owner || newAccount.owner || "",
       name: responseData.name || newAccount.name || "",
       number: responseData.number || newAccount.number || "",
       website: responseData.website || newAccount.website || "",
       type: responseData.type || newAccount.type || "Customer",
       revenue: formatRevenue(apiRevenue),
     };


     if (editingAccount) {
       setAccounts(
         accounts.map((a) =>
           a.id === editingAccount.id ? updatedAccountData : a
         )
       );
     } else {
       setAccounts([...accounts, updatedAccountData]);
     }

     setSuccess(
       editingAccount
         ? "Account updated successfully!"
         : "Account created successfully!"
     );
     setTimeout(() => setSuccess(null), 3000);
   } catch (err: any) {
     console.error("Error saving account:", err);
     setError(
       `Error ${editingAccount ? "updating" : "creating"} account: ${
         err.message
       }`
     );
     setTimeout(() => setError(null), 5000);
   } finally {
     setShowForm(false);
     setEditingAccount(null);
     setPreviousRevenue(null);
     await fetchAccounts(); // Refetch to ensure consistency
   }
 };

  const handleDeleteAccount = async (id: string) => {
    let successMessage = null;
    try {
      const res = await fetch(`http://localhost:5000/api/crm/accounts/${id}`, {
        method: "DELETE",
      });
      
      successMessage = "Account deleted successfully!";
    } catch (err: any) {
      console.error("Error deleting account:", err);
      setError("Error deleting account");
      setTimeout(() => setError(null), 5000);
    } finally {
      await fetchAccounts(); // Always sync UI
      if (successMessage) {
        setSuccess(successMessage);
        setTimeout(() => setSuccess(null), 3000);
      }
    }
  };

  const handleUpdateAccount = (account: Account) => {
    setEditingAccount(account);
    setPreviousRevenue(getNumericRevenue(account.revenue));
    setShowForm(true);
  };

  const handleDeleteAll = async () => {
    try {
      const deletePromises = accounts.map((account) =>
        fetch(`http://localhost:5000/api/crm/${account.id}`, {
          method: "DELETE",
        })
      );
      const results = await Promise.allSettled(deletePromises);
      const failedDeletions = results.filter(
        (result) => result.status === "rejected"
      );
      if (failedDeletions.length > 0) throw new Error("Some deletions failed");
      setSuccess("All accounts deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Error deleting all accounts");
      setTimeout(() => setError(null), 5000);
    } finally {
      await fetchAccounts(); // Always sync UI
    }
  };

  return (
    <div className="relative p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Accounts
        </h1>
        <div className="text-sm">
          {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
          {success && (
            <p className="text-green-600 dark:text-green-400">{success}</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between md:hidden mb-3">
            <span className="font-medium text-lg text-blue-900 dark:text-white">
              All Accounts
            </span>
            <span className="bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white text-xs font-semibold px-2 py-1 rounded-full">
              {accounts.length}
            </span>
          </div>

          <div className="flex flex-row justify-between md:hidden mb-3 max-[375px]:flex-col max-[375px]:items-center max-[375px]:space-y-2">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 max-[375px]:w-full min-[375px]:max-[426px]:mr-2"
            >
              <Plus className="mr-2" size={18} />
              Add New Account
            </button>
            <div className="relative max-[375px]:w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions((v) => !v);
                }}
                className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-blue-800 bg-blue-900 text-white max-[375px]:w-full"
              >
                <Sliders className="mr-2" size={16} />
                Actions
              </button>
              {showActions && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10"
                  onMouseLeave={() => setShowActions(false)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAll();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Delete All
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex justify-between items-center">
            <button className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white rounded-full font-medium">
              All Accounts
              <span className="ml-2 bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {accounts.length}
              </span>
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions((v) => !v);
                  }}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center"
                >
                  <Sliders className="mr-2" size={16} />
                  Actions
                </button>
                {showActions && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10"
                    onMouseLeave={() => setShowActions(false)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAll();
                      }}
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
                <Plus className="mr-2" size={16} />
                Add New Account
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto rounded-xl border dark:border-gray-700 border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white">
              <tr>
                <th className="px-6 py-3 font-semibold text-left">
                  Account Owner
                </th>
                <th className="px-6 py-3 font-semibold text-left">Name</th>
                <th className="px-6 py-3 font-semibold text-left">Number</th>
                <th className="px-6 py-3 font-semibold text-left">Website</th>
                <th className="px-6 py-3 font-semibold text-left">Type</th>
                <th className="px-6 py-3 font-semibold text-left">Revenue</th>
                <th className="px-6 py-3 font-semibold text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No accounts available.
                  </td>
                </tr>
              ) : (
                accounts.map((a) => {
                  const isSel = a.id === selectedId;
                  return (
                    <tr
                      key={a.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(isSel ? null : a.id);
                      }}
                      className={`cursor-pointer border-t border-gray-100 dark:border-gray-700 `}
                    >
                      <td className="px-6 py-4 text-blue-900 dark:text-white">
                        {a.owner}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {a.name}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {a.number}
                      </td>
                      <td className="px-6 py-4 text-blue-600 dark:text-blue-300 underline">
                        {a.website ? (
                          <a href={a.website} target="_blank" rel="noreferrer">
                            {a.website}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {a.type}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {a.revenue}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 max-[375px]:flex-col max-[375px]:space-x-0 max-[375px]:space-y-2 max-[375px]:items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateAccount(a);
                            }}
                            className="px-3 py-1 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600 max-[375px]:w-full"
                          >
                            Update
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAccount(a.id);
                            }}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 max-[375px]:w-full"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {accounts.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 py-4">
              No accounts available.
            </div>
          ) : (
            accounts.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedId(a.id === selectedId ? null : a.id)}
                className={`p-4 rounded-lg cursor-pointer ${
                  a.id === selectedId
                    ? "bg-emerald-100 dark:bg-emerald-800"
                    : "bg-emerald-50 dark:bg-emerald-900"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-900 dark:text-white">
                    {a.name}
                  </span>
                  <div className="flex space-x-2 max-[375px]:flex-col max-[375px]:space-x-0 max-[375px]:space-y-2 max-[375px]:items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateAccount(a);
                      }}
                      className="px-3 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600 max-[375px]:w-full"
                    >
                      Update
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAccount(a.id);
                      }}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 max-[375px]:w-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="font-semibold">Owner:</span> {a.owner}
                  </div>
                  <div>
                    <span className="font-semibold">Number:</span> {a.number}
                  </div>
                  <div>
                    <span className="font-semibold">Website:</span>{" "}
                    {a.website ? (
                      <a
                        href={a.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-300 underline"
                      >
                        {a.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Type:</span> {a.type}
                  </div>
                  <div>
                    <span className="font-semibold">Revenue:</span> {a.revenue}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <AddNewAccount
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingAccount(null);
              setPreviousRevenue(null);
            }}
            editingAccount={editingAccount}
          />
        </div>
      )}
    </div>
  );
}
