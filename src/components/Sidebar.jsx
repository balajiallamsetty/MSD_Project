import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaShieldAlt,
  FaTachometerAlt,
  FaRocket,
  FaPhone,
  FaInfoCircle,
  FaUtensils,
  FaFire,
  FaChartLine,
  FaUserMd,
  FaFileMedical,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <FaShieldAlt size={40} />
        <span className="logo-text">HealthyDiet</span>
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="home" className="sidebar-link">
            <FaTachometerAlt />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="features" className="sidebar-link">
            <FaRocket />
            <span>Features</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="contact" className="sidebar-link">
            <FaPhone />
            <span>Contact</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="about" className="sidebar-link">
            <FaInfoCircle />
            <span>About</span>
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-profile">
        <NavLink to="profile" className="profile-card">
          <img src="/profile.png" alt="Profile" className="profile-avatar" />
          <span className="profile-name">Profile</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
