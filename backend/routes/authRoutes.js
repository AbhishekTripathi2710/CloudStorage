const express = require("express");
const { register, login, logout, getProfile } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const router = express.Router();



router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.get("/me", requireAuth, getProfile);

module.exports = router;