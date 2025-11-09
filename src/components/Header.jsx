import { CalendarDays, LogOut, Bell } from "lucide-react";

export default function Header({ user, selectedDate, setSelectedDate, onLogout, onNotify }) {
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full" style={{ background: user?.avatar_color || "#6366f1" }} />
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Hi {user?.name?.split(" ")[0] || "there"} 👋</h1>
          <p className="text-sm text-gray-500">Stay disciplined. Small wins daily.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-lg px-3 py-2 shadow-sm border">
          <CalendarDays className="h-4 w-4 text-indigo-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={"2020-01-01"}
            className="bg-transparent outline-none text-sm"
          />
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Today
          </button>
        </div>
        <button
          onClick={onNotify}
          title="Enable reminders"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
        >
          <Bell className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">Reminders</span>
        </button>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-gray-50 border shadow-sm text-gray-700"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
