const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ✅ Allowed origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:5173",              // local frontend
  "https://msd-project-pied.vercel.app" // deployed frontend on Vercel
];

// ✅ Enable CORS with dynamic origin checking
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests for all routes
app.options("*", cors());

// ✅ Middleware to parse JSON request bodies
app.use(express.json());

// ✅ Routes
app.use("/api/users", require("./routes/userRoutes"));

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("API is running successfully 🚀");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
