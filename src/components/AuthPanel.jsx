import { useState } from "react";

export default function AuthPanel({ onAuthenticated, backendUrl }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        const res = await fetch(`${backendUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Registration failed");
        onAuthenticated(data);
      } else {
        const body = new URLSearchParams();
        body.append("username", email);
        body.append("password", password);
        const res = await fetch(`${backendUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Login failed");
        onAuthenticated(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg border">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h2>
      <p className="text-gray-500 text-center mb-6">Daily Task Manager</p>

      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>
        )}

        <button
          disabled={loading}
          className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-600 text-white py-2.5 hover:bg-indigo-700 transition"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600 mt-4">
        {mode === "login" ? (
          <button className="text-indigo-600 hover:text-indigo-700" onClick={() => setMode("register")}>
            Need an account? Sign up
          </button>
        ) : (
          <button className="text-indigo-600 hover:text-indigo-700" onClick={() => setMode("login")}>
            Already have an account? Log in
          </button>
        )}
      </div>
    </div>
  );
}
