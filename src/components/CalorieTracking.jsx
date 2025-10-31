import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CalorieTracking.css";

function CalorieTracking({ setActivePage }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCalories = async (e) => {
    e.preventDefault();
    if (!query || !date) return;

    setLoading(true);
    setResult(null);

    try {
      const API_KEY = "ZT+UFNBZJ148KDPSvp98/A==XRPwQGENVbUQSVvx"; // replace with your CalorieNinjas API key
      const response = await fetch(
        `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(
          query
        )}`,
        {
          headers: { "X-Api-Key": API_KEY },
        }
      );

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const food = data.items[0];
        const calories = food.calories;
        const servingSize = food.serving_size_g;
        const per100 = (calories / servingSize) * 100;

        setResult({
          name: food.name,
          calories,
          serving_size: servingSize,
          per100,
        });

        // --- Save to localStorage ---
        const stored = JSON.parse(localStorage.getItem("calorieData")) || {};
        stored[date] = (stored[date] || 0) + calories;
        localStorage.setItem("calorieData", JSON.stringify(stored));
      } else {
        setResult({ error: "Food not found!" });
      }
    } catch (error) {
      setResult({ error: "API error. Try again later." });
    }

    setLoading(false);
  };

  const navigate = useNavigate();

  return (
    <section className="card">
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard/features")}
      >
        ← Back
      </button>
      <h2>🔥 Calorie Tracking</h2>
      <p>Enter a date and food description to track calories.</p>

      <form onSubmit={fetchCalories} className="flex flex-col gap-2 mb-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="e.g. oats, 100g rice"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {loading && <p>⏳ Checking...</p>}

      {result && !result.error && (
        <div className="result-box">
          <h4>{result.name}</h4>
          <p>
            {result.calories} kcal for {result.serving_size} g
          </p>
          <p>≈ {result.per100.toFixed(2)} kcal per 100g</p>
          <p style={{ color: "green" }}>✔ Added to {date}'s total</p>
        </div>
      )}

      {result && result.error && <p style={{ color: "red" }}>{result.error}</p>}
    </section>
  );
}

export default CalorieTracking;
