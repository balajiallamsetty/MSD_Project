import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!user) return null; 

  return (
    <div className="profile-container">
      <div className="profile-details">
        <img src="/profile.png" alt="Profile" className="profile-avatar-lg" />
        <h3 className="user-name">{user.username}</h3>
        <p className="user-email">{user.email}</p>
      </div>
      <button className="logout-btn" onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default Profile;
