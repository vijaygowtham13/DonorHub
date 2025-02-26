const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Register || POST Method
router.post("/register", registerController);

// Login || POST Method
router.post("/login", loginController);

// Get Current User || GET Method
router.get("/current-user", authMiddleware, currentUserController);

module.exports = router;
