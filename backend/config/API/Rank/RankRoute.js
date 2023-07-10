const express = require("express");
const {
  getLeaderboard,
  updateLeaderboard,
} = require("../../../controllers/RankController/rankController");
const {
  authenticate,
} = require("../../../controllers/UserController/AuthController/authController");

const router = express.Router();
router.use(authenticate);
router.get("/", getLeaderboard);
router.post("/", updateLeaderboard);
module.exports = router;
