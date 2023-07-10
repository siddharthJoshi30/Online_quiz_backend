const express = require("express");
const {
  authenticate,
} = require("../../../controllers/UserController/AuthController/authController");
const {
  validateUserAnswers,
  getUserById,
} = require("../../../controllers/UserController/RoleController/roleController");

const router = express.Router();
router.use(authenticate);
router.get("/:id", getUserById);
router.post("/quiz/:id", validateUserAnswers);
module.exports = router;
