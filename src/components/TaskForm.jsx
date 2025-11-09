import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function TaskForm({ backendUrl, token, selectedDate, onCreated }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTime("");
  }, [selectedDate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, notes: notes || undefined, date: selectedDate, time: time || undefined, priority }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to add task");
      setTitle("");
      setNotes("");
      setTime("");
      setPriority(2);
      onCreated?.(data);
      // schedule local notification
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const when = time ? new Date(`${selectedDate}T${time}:00`) : new Date(`${selectedDate}T09:00:00`);
          const delay = when.getTime() - Date.now();
          if (delay > 0 && delay < 7 * 24 * 60 * 60 * 1000) {
            setTimeout(() => {
              new Notification("Task Reminder", {
                body: `${data.title} • ${selectedDate}${time ? ` ${time}` : ""}`,
              });
            }, delay);
          }
        } catch {}
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white/70 backdrop-blur rounded-xl p-4 border shadow-sm space-y-3">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your next important task?"
          className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-28 rounded-lg border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex gap-2 items-center">
        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </form>
  );
}
