const { generateJwtToken } = require("../AuthController/authController");
const User = require("../../../models/UserModel/userModel");
const { Quiz } = require("../../../models/QuizModel/quizModel");
module.exports.validateUserAnswers = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: quizId } = req.params;
    const userQuestions = req.body || [];
    if (!userId || !Array.isArray(userQuestions)) {
      return res.status(400).json({ message: "Invalid Input" });
    }
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json({ message: "Quiz not found" });
    }
    const { questions = [], numberOfQuestions } = quiz || {};
    let points = 0;
    const _validatedQs = userQuestions.map((question) => {
      const { _id, text, answer } =
        questions.find((q) => q._id.toString() === question.id) || {};
      if (_id && answer && question && question.selected === answer) {
        points += quiz.pointsPerQuestion;
        return {
          _id,
          text,
          selected: question.selected,
          answer,
          correct: true,
        };
      }
      return { _id, text, selected: question.selected, answer, correct: false };
    });
    const user = await User.findById(userId);
    if (user) {
      if (
        !user.completed.find((q) => q.id.toString() === quiz._id.toString())
      ) {
        user.completed.push({
          id: quiz._id,
          questions: _validatedQs,
          points,
        });
      }
      await user.save();
    }
    res.status(200).json({
      response: {
        id: quiz._id,
        questions: _validatedQs,
        numberOfQuestions,
        points,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User doesn't exists");
    }
    const token = generateJwtToken(user._id);
    res.status(200).json({ response: { ...user.toObject(), token } });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
