const express = require("express");
const authRouter = require("../Auth/Authenticator");
const userRouter = require("../User/UserRoute");
const quizRouter = require("../Exam/ExamRoute");
const leaderboardRouter = require("../Rank/RankRoute");

const router = express.Router();
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/quiz", quizRouter);
router.use("/leaderboard", leaderboardRouter);
module.exports = router;
