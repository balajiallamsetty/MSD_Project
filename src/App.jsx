import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Dashboard sub-pages
import Home from "./components/Home";
import Features from "./components/Features";
import Contact from "./components/Contact";
import About from "./components/About";
import MealPlanning from "./components/MealPlanning";
import CalorieTracking from "./components/CalorieTracking";
import ProgressReports from "./components/ProgressReports";
import ExpertBooking from "./components/ExpertBooking";
import HealthReports from "./components/HealthReports";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="meal-planning" element={<MealPlanning />} />
          <Route path="calorie-tracking" element={<CalorieTracking />} />
          <Route path="progress-reports" element={<ProgressReports />} />
          <Route path="expert-booking" element={<ExpertBooking />} />
          <Route path="health-reports" element={<HealthReports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
