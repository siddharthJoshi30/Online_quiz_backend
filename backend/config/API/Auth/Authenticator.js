const express = require("express");
const {
  register,
  login,
} = require("../../../controllers/UserController/AuthController/authController");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
module.exports = router;
