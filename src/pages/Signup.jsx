import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

// Resolve API base URL with fallbacks to avoid 'undefined/...'
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://msd-project-weab.onrender.com');

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ fixed: use 'username' instead of 'name'
        body: JSON.stringify({ username, email, password }),
      });
      
      // Safely parse JSON; backend may return empty body on errors
      let data = {};
      try {
        data = await response.json();
      } catch (_) {
        // ignore parse errors; fallback to empty object
      }

      if (response.ok) {
        alert("Signup successful! You can login now.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Signup</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
