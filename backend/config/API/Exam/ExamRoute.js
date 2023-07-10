const express = require("express");
const {
  authenticate,
  authorize,
} = require("../../../controllers/UserController/AuthController/authController");
const {
  getAllQuizes,
  getQuizById,
  getQuizesByCategory,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizAnswersById,
} = require("../../../controllers/ExamController/examController");

const router = express.Router();
router.use(authenticate);
router.get("/", getAllQuizes);
router.get("/category/:id", getQuizesByCategory);
router.get("/:id", getQuizById);
router.get("/:id/answers", getQuizAnswersById);
router.use(authorize("ADMIN"));
router.post("/", createQuiz);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);
module.exports = router;
