import { useState } from "react";

function Login({ onLogin, onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("nexusflowToken", data.token);
      localStorage.setItem(
        "nexusflowUser",
        JSON.stringify(data.user)
      );

      onLogin(data.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">N</div>

        <h1>NexusFlow</h1>

        <p className="login-subtitle">
          Visual IoT Telemetry & Rule Engine
        </p>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="login-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={onCreateAccount}
            style={{
              border: "none",
              background: "none",
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Create Account
          </button>
        </p>

        <p className="login-footer">
          IoT Monitoring & Automation Platform
        </p>
      </div>
    </div>
  );
}

export default Login;