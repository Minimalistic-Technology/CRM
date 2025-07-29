import { Sliders, Plus } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

interface MeetingItem {
  _id: string;
  name: string;
  venue: string;
  from: string;
  to: string;
}

type MeetingFormData = Omit<MeetingItem, "_id">;

const Meeting: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MeetingFormData>({
    name: "",
    venue: "",
    from: "",
    to: "",
  });
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(
    new Set()
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMeetings = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/crm/meetings", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setMeetings(data);
    } catch (err) {}
  }, []);

  const sendNotification = async (meeting: MeetingItem) => {
    const notificationKey = `${meeting._id}-${meeting.from}`;
    if (sentNotifications.has(notificationKey)) return;

    try {
      const payload = {
        userId: "global",
        message: `Meeting "${meeting.name}" started ${formatIST(
          meeting.from
        )}.`,
        type: "meeting",
      };
      const res = await fetch("http://localhost:5000/api/crm/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setSentNotifications((prev) => new Set(prev).add(notificationKey));
    } catch (err) {}
  };

  const scheduleNextNotification = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const now = Date.now();
    const futureMeetings = meetings.filter(
      (m) => new Date(m.from).getTime() > now
    );
    if (futureMeetings.length === 0) return;
    const nextMeeting = futureMeetings.reduce((earliest, current) =>
      new Date(current.from).getTime() < new Date(earliest.from).getTime()
        ? current
        : earliest
    );
    const delay = new Date(nextMeeting.from).getTime() - now;
    timeoutRef.current = setTimeout(() => {
      sendNotification(nextMeeting);
      scheduleNextNotification();
    }, delay);
  }, [meetings, sentNotifications]);

  useEffect(() => {
    fetchMeetings();
    const interval = setInterval(() => {
      fetchMeetings();
    }, 30 * 1000);
    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [fetchMeetings]);

  useEffect(() => {
    scheduleNextNotification();
  }, [meetings, scheduleNextNotification]);

  const formatDateForInput = (iso: string) => {
    const date = new Date(iso);
    return new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        from: new Date(formData.from).toISOString(),
        to: new Date(formData.to).toISOString(),
      };
      const url = selectedId
        ? `http://localhost:5000/api/crm/meetings/${selectedId}`
        : "http://localhost:5000/api/crm/meetings";
      const method = selectedId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      if (selectedId) {
        setMeetings((prev) =>
          prev.map((m) => (m._id === selectedId ? data : m))
        );
        alert("Meeting updated successfully!");
      } else {
        setMeetings((prev) => [...prev, data]);
        alert("Meeting added successfully!");
      }
      setFormData({ name: "", venue: "", from: "", to: "" });
      setSelectedId(null);
      setShowForm(false);
    } catch (err) {
      alert(selectedId ? "Error updating meeting" : "Error adding meeting");
    }
  };

  const handleUpdate = (meeting: MeetingItem) => {
    setFormData({
      name: meeting.name,
      venue: meeting.venue,
      from: formatDateForInput(meeting.from),
      to: formatDateForInput(meeting.to),
    });
    setSelectedId(meeting._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/crm/meetings/${selectedId}`,
        {
          method: "DELETE",
        }
      );
      setMeetings((prev) => prev.filter((m) => m._id !== selectedId));
      setSelectedId(null);
      setShowActions(false);
    } catch (err) {}
  };

  const handleDeleteAll = async () => {
    try {
      const deletePromises = meetings.map((m) =>
        fetch(`http://localhost:5000/api/meetings/${m._id}`, {
          method: "DELETE",
        })
      );
      await Promise.all(deletePromises);
      setMeetings([]);
      setSelectedId(null);
      setShowActions(false);
    } catch (err) {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatIST = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="relative p-4 sm:p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-blue-900 dark:text-white">
          Meetings
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <button className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white rounded-full font-medium">
            All Meetings
            <span className="ml-2 bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {meetings.length}
            </span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions((v) => !v);
                }}
                className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-blue-800 bg-blue-900 text-white flex items-center justify-center"
              >
                <Sliders className="mr-2" size={16} /> Actions
              </button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    disabled={!selectedId}
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAll();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Delete All
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(null);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-blue-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    Deselect
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setFormData({ name: "", venue: "", from: "", to: "" });
                setSelectedId(null);
                setShowForm(true);
              }}
              className="flex items-center justify-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 w-full sm:w-auto"
            >
              <Plus className="mr-2" size={16} />
              Add New Meeting
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white text-left">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-semibold">
                  Meeting Name
                </th>
                <th className="px-4 sm:px-6 py-3 font-semibold">
                  Meeting Venue
                </th>
                <th className="px-4 sm:px-6 py-3 font-semibold">From</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">To</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No meetings available.
                  </td>
                </tr>
              ) : (
                meetings.map((meeting) => (
                  <tr
                    key={meeting._id}
                    className="border-t border-gray-100 dark:border-gray-700"
                  >
                    <td className="px-4 py-4 text-blue-900 dark:text-white">
                      {meeting.name}
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                      {meeting.venue}
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                      {formatIST(meeting.from)}
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                      {formatIST(meeting.to)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdate(meeting)}
                          className="px-3 py-1 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(meeting._id);
                            handleDelete();
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
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
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md text-black">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {selectedId ? "Edit Meeting" : "Add New Meeting"}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Meeting Name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="datetime-local"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="datetime-local"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  Save Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default Meeting;
