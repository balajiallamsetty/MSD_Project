import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

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
        const response = await fetch("http://localhost:5000/api/users/dashboard", {
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
            <h2>Welcome, {user.name} 👋</h2>
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
