import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProgressReports.css";

function ProgressReports({ setActivePage }) {
  const [dailyData, setDailyData] = useState({});
  const [weeklyCalories, setWeeklyCalories] = useState(0);
  const [monthlyCalories, setMonthlyCalories] = useState(0);

  useEffect(() => {
    // Load stored data
    const stored = JSON.parse(localStorage.getItem("calorieData")) || {};
    setDailyData(stored);

    const today = new Date();
    let weekTotal = 0;
    let monthTotal = 0;

    Object.entries(stored).forEach(([date, calories]) => {
      const entryDate = new Date(date);
      const diffDays = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 6) weekTotal += calories;
      if (diffDays <= 29) monthTotal += calories;
    });

    setWeeklyCalories(weekTotal);
    setMonthlyCalories(monthTotal);
  }, []);
  const navigate = useNavigate();

  return (
    <section className="card">
      <button className="back-btn" onClick={() => navigate("/dashboard/features")}>
  ← Back
</button>
      <h2>📈 Progress Reports</h2>
      <p>Weekly and monthly summaries of your calorie intake.</p>

      <div className="summary-box">
        <h4>Summary</h4>
        <ul>
          <li>Weekly Calories: {weeklyCalories} kcal</li>
          <li>Monthly Calories: {monthlyCalories} kcal</li>
        </ul>
      </div>

      <h4>📅 Daily Breakdown</h4>
      <ul>
        {Object.entries(dailyData).map(([date, calories]) => (
          <li key={date}>
            {date}: {calories} kcal
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProgressReports;
