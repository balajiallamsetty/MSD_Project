const express = require("express");
const { signup, login, dashboard } = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/dashboard", verifyToken, dashboard);

module.exports = router;
