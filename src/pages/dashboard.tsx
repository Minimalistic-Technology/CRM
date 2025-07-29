"use client";

import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

// ——— Interface Definitions ———
interface UserProfile {
  fullName: string;
  personal: {
    email: string;
  };
}

interface Lead {
  _id: string;
  leadOwner: string;
  firstName: string;
  lastName: string;
  phone: string;
}
interface Meeting {
  _id: string;
  name: string;
  from?: string;
  to?: string;
  venue?: string;
}
interface Task {
  _id: string;
  owner: string;
  subject: string;
  status: string;
  due?: string;
  priority: string;
}
interface Deal {
  _id: string;
  name: string;
  company: string;
  stage: string;
  closeDate?: string;
  dealValue: number;
}

interface DashboardResponse {
  leads: Lead[];
  meetings: Meeting[];
  tasks: Task[];
  deals: Deal[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("Guest");
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setUserError("No user email found");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/crm/user-profiles",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const profiles = await response.json();
        const userProfile = profiles.find(
          (p: UserProfile) => p.personal.email === email
        );

        if (!userProfile) {
          throw new Error("Profile not found for this email");
        }

        setFullName(userProfile.fullName || "Guest");
        setUserError(null);
      } catch (err) {
        console.error("User profile fetch error:", err);
        setUserError("Failed to load user profile");
        setFullName("Guest");
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/crm/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<DashboardResponse>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  const { tasks = [], meetings = [], leads = [], deals = [] } = data || {};

  return (
    <div className="relative p-6 space-y-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-white antialiased">
        Welcome {fullName},
      </h1>

      {error && (
        <div className="text-red-500 font-medium antialiased">{error}</div>
      )}
      {userError && (
        <div className="text-red-500 font-medium antialiased">{userError}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ——— Tasks ——— */}
        <Card title="My Open Tasks">
          <div className="min-h-[200px] antialiased">
            {tasks.length > 0 ? (
              <Table
                loading={loading}
                columns={["Owner", "Subject", "Status", "Due Date", "Priority"]}
                data={tasks.map((t) => ({
                  Owner: t.owner,
                  Subject: { text: t.subject, link: false },
                  Status: t.status,
                  "Due Date": t.due ? new Date(t.due).toLocaleDateString() : "",
                  Priority: t.priority,
                }))}
              />
            ) : (
              !loading && <EmptyState message="No open tasks" />
            )}
          </div>
        </Card>

        {/* ——— Meetings ——— */}
        <Card title="My Meetings">
          <div className="min-h-[200px] antialiased">
            {meetings.length > 0 ? (
              <Table
                loading={loading}
                columns={["Title", "From", "To", "Venue"]}
                data={meetings.map((m) => ({
                  Title: { text: m.name, link: false },
                  From: m.from ? new Date(m.from).toLocaleString() : "",
                  To: m.to ? new Date(m.to).toLocaleString() : "",
                  Venue: m.venue || "",
                }))}
              />
            ) : (
              !loading && <EmptyState message="No upcoming meetings" />
            )}
          </div>
        </Card>

        {/* ——— Leads ——— */}
        <Card title="Today's Leads">
          <div className="min-h-[200px] antialiased">
            {leads.length > 0 ? (
              <Table
                loading={loading}
                columns={["Lead Owner", "First name", "Last name", "Phone"]}
                data={leads.map((l) => ({
                  "Lead Owner": l.leadOwner,
                  "First name": l.firstName,
                  "Last name": l.lastName,
                  Phone: l.phone,
                }))}
              />
            ) : (
              !loading && <EmptyState message="No leads for today" />
            )}
          </div>
        </Card>

        {/* ——— Deals ——— */}
        <Card title="My Deals">
          <div className="min-h-[200px] antialiased">
            {deals.length > 0 ? (
              <Table
                loading={loading}
                columns={[
                  "Deal Name",
                  "company Name",
                  "Stage",
                  "Close Date",
                  "Deal Value",
                ]}
                data={deals.map((d) => ({
                  "Deal Name": { text: d.name, link: false },
                  "company Name": { text: d.company, link: false },
                  Stage: d.stage,
                  "Close Date": d.closeDate
                    ? new Date(d.closeDate).toLocaleDateString()
                    : "",
                  "Deal Value": d.dealValue
                    ? ` $ ${d.dealValue.toLocaleString()}`
                    : "",
                }))}
              />
            ) : (
              !loading && <EmptyState message="No deals closing this month" />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
