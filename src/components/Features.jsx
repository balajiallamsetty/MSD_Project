import React from "react";
import { NavLink } from "react-router-dom";
import "./Features.css";

function Features() {
  const features = [
    { key: "meal", emoji: "🥗", label: "Meal Planning", route: "/dashboard/meal-planning" },
    { key: "calorie", emoji: "🔥", label: "Calorie Tracking", route: "/dashboard/calorie-tracking" },
    { key: "progress", emoji: "📈", label: "Progress Reports", route: "/dashboard/progress-reports" },
    { key: "expert", emoji: "👩‍⚕️", label: "Expert Booking", route: "/dashboard/expert-booking" },
    // { key: "health", emoji: "📝", label: "Health Reports", route: "/dashboard/health-reports" }
  ];

  return (
    <div className="features">
      <h2 className="features-title">✨ Features</h2>
      <div className="feature-grid">
        {features.map((feat) => (
          <NavLink
            key={feat.key}
            className={({ isActive }) =>
              "feature-card" + (isActive ? " active" : "")
            }
            to={feat.route}
            tabIndex={0}
          >
            <span className="feature-emoji">{feat.emoji}</span>
            <span className="feature-label">{feat.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
export default Features;
