const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ✅ Allow requests from your React frontend
app.use(
  cors({
    origin: "http://localhost:5173", // React app running on Vite
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allows cookies/tokens
  })
);

// ✅ Middleware to parse JSON request bodies
app.use(express.json());

// ✅ User routes
app.use("/api/users", require("./routes/userRoutes"));

// ✅ Root route (for testing server)
app.get("/", (req, res) => {
  res.send("API is running successfully 🚀");
});

// ✅ Error Handling Middleware (optional but useful)
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
