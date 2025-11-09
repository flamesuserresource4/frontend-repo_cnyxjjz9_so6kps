import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-white/60">
      <button onClick={() => onToggle(task)} className="mt-0.5">
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
            {task.title}
          </p>
          {task.time && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {task.time}
            </span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border">
            {task.date}
          </span>
        </div>
        {task.notes && <p className="text-sm text-gray-600 line-clamp-2">{task.notes}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-2 rounded-md hover:bg-red-50 text-red-600"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function TaskList({ backendUrl, token, selectedDate }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/tasks?start=${selectedDate}&end=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to load tasks");
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedDate]);

  const toggle = async (task) => {
    const res = await fetch(`${backendUrl}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ completed: !task.completed }),
    });
    const data = await res.json();
    if (res.ok) setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)));
  };

  const edit = async (task) => {
    const title = prompt("Update task title", task.title);
    if (title === null) return;
    const notes = prompt("Update notes (optional)", task.notes || "");
    const date = prompt("Update date (YYYY-MM-DD)", task.date);
    const time = prompt("Update time (HH:MM)", task.time || "");
    const res = await fetch(`${backendUrl}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, notes: notes || null, date, time: time || null }),
    });
    const data = await res.json();
    if (res.ok) setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)));
  };

  const del = async (task) => {
    if (!confirm("Delete this task?")) return;
    const res = await fetch(`${backendUrl}/tasks/${task.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <section className="space-y-3">
      {loading ? (
        <p className="text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks for this day. Add your first one above.</p>
      ) : (
        tasks.map((t) => (
          <TaskItem key={t.id} task={t} onToggle={toggle} onEdit={edit} onDelete={del} />
        ))
      )}
    </section>
  );
}
