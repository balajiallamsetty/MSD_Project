import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

// Use the same API base as Login/Signup (update to local URL for dev if needed)
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://msd-project-lim3.onrender.com');


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    // Fetch user info from protected backend route
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          alert(data.message || "Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        alert("Server error. Please try again later.");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        {user ? (
          <>
            <h2>Welcome, {user.username} 👋</h2>
            <Outlet />
          </>
        ) : (
          <p>Loading your dashboard...</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
