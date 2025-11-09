import { useEffect, useMemo, useState } from "react";
import AuthPanel from "./components/AuthPanel";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import HeroScene from "./components/HeroScene";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

export default function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const token = auth?.access_token;
  const user = auth?.user;

  useEffect(() => {
    if (auth) localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  const enableNotifications = async () => {
    if (!("Notification" in window)) return alert("Notifications not supported on this device.");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return alert("Please allow notifications to receive reminders.");
    new Notification("You're all set!", { body: "We'll remind you about your tasks." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <HeroScene />

        {!token ? (
          <AuthPanel onAuthenticated={setAuth} backendUrl={backendUrl} />
        ) : (
          <div className="space-y-6">
            <Header
              user={user}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onLogout={logout}
              onNotify={enableNotifications}
            />

            <TaskForm backendUrl={backendUrl} token={token} selectedDate={selectedDate} onCreated={() => {}} />

            <TaskList backendUrl={backendUrl} token={token} selectedDate={selectedDate} />
          </div>
        )}
      </div>
    </div>
  );
}
