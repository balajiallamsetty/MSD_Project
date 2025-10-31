import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-info">
      <div className="app-hero">
        <h1 className="app-title">NutriCoach Dashboard</h1>
        <p className="app-subtitle">
          Your all-in-one platform for personalized nutrition and healthy living.
        </p>
      </div>

      <div className="features-overview">
        <h2>What Can You Do Here?</h2>
        <ul>
          <li>🥗 Plan balanced meals tailored to your specific health goals</li>
          <li>🔥 Track daily calorie intake and nutrient breakdown</li>
          <li>📊 Analyze your progress and get automated insights</li>
          <li>👩‍⚕️ Book expert consultations and get professional advice</li>
          <li>📝 View reports of your diet, activity, and doctor visits</li>
        </ul>
      </div>

      <div className="motivational-panel">
        <h3>Ready to Start?</h3>
        <p>
          Use the sidebar to navigate features and begin your journey toward a healthier you!
        </p>
        <p className="quote">
          "Small steps every day lead to big results. Let's get started!"
        </p>
      </div>

      <div className="support-info">
        <h4>Need Help?</h4>
        <p>
          Visit our <a href="mailto:balajiallamsetty.com">support center</a> or contact your coach for guidance.
        </p>
      </div>
    </div>
  );
}

export default Home;
