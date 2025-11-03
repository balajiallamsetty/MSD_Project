import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://msd-project-lim3.onrender.com');


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      let data = {};
      try {
        data = await response.json();
      } catch (_) {
        // response may be empty or non-JSON on some errors
      }

      if (response.ok) {
        // ✅ Only store the token (since backend doesn't send user data)
        localStorage.setItem("token", data.token);

        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
