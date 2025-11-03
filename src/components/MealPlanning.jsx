import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import foods from "/src/backend/foods.json"; 
import "./Mealplanning.css";

const MealPlanner = () => {
  const navigate = useNavigate();
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [goal, setGoal] = useState("weight_loss");
  const [weeklyCalories, setWeeklyCalories] = useState(0);

  const generateMealPlan = () => {
    let targetCalories = 1800;

    if (goal === "weight_loss") targetCalories -= 300;
    else if (goal === "weight_gain") targetCalories += 300;
    else if (goal === "gym") targetCalories += 200;

    const categories = ["breakfast", "lunch", "dinner", "snack"];
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];

    let totalWeekCalories = 0;

    const fullWeekPlan = days.map((day) => {
      let dayPlan = [];
      let calories = 0;

      categories.forEach((cat) => {
        let options = foods.filter((f) => f.category === cat);

        // ✅ filtering rules based on goal
        if (goal === "high_protein") {
          options = options.filter((f) => f.protein >= 15);
        } else if (goal === "high_carb") {
          options = options.filter((f) => f.carbs >= 25);
        } else if (goal === "low_carb") {
          options = options.filter((f) => f.carbs <= 15);
        } else if (goal === "gym") {
          options = options.filter((f) => f.protein >= 10 && f.carbs >= 20);
        }

        // fallback if no food matches
        if (options.length === 0) {
          options = foods.filter((f) => f.category === cat);
        }

        // pick random food from filtered options
        const randomFood =
          options[Math.floor(Math.random() * options.length)];
        dayPlan.push(randomFood);
        calories += randomFood.calories;
      });

      totalWeekCalories += calories;
      return { day, meals: dayPlan, calories };
    });

    setWeeklyPlan(fullWeekPlan);
    setWeeklyCalories(totalWeekCalories);
  };

  return (
    <div className="meal-planner">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="title">🍽️ Weekly Meal Planner</h2>

      <div className="controls">
        <label>Select Goal:</label>
        <select value={goal} onChange={(e) => setGoal(e.target.value)}>
          <option value="weight_loss">Weight Loss</option>
          <option value="weight_gain">Weight Gain</option>
          <option value="healthy">Healthy/Maintenance</option>
          <option value="high_protein">High Protein</option>
          <option value="high_carb">High Carbohydrates</option>
          <option value="low_carb">Low Carbohydrates</option>
          <option value="gym">Gym Diet</option>
        </select>
        <button onClick={generateMealPlan}>Generate Weekly Plan</button>
      </div>

      {weeklyPlan.length > 0 && (
        <div className="week-plan">
          {weeklyPlan.map((dayPlan, idx) => (
            <div key={idx} className="day-plan">
              <h3>📅 {dayPlan.day}</h3>
              <div className="meals-grid">
                {dayPlan.meals.map((meal, mIdx) => (
                  <div key={mIdx} className="meal-card">
                    <h4>{meal.category.toUpperCase()}</h4>
                    <p className="food">{meal.food}</p>
                    <p><strong>Calories:</strong> {meal.calories} kcal</p>
                    <p><strong>Protein:</strong> {meal.protein} g</p>
                    <p><strong>Carbs:</strong> {meal.carbs} g</p>
                    <p><strong>Fat:</strong> {meal.fat} g</p>
                  </div>
                ))}
              </div>
              <div className="summary">
                <h4>🔥 Daily Calories: {dayPlan.calories} kcal</h4>
              </div>
            </div>
          ))}

          <div className="weekly-summary">
            <h3>📊 Weekly Summary</h3>
            <p><strong>Total Weekly Calories:</strong> {weeklyCalories} kcal</p>
            <p>🎯 Target Goal: {goal.replace("_", " ")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
