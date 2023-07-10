const { Quiz } = require("../../models/QuizModel/quizModel");

module.exports.getAllQuizes = async (req, res) => {
  try {
    const quizes = await Quiz.find({});
    return res.status(200).json({ response: quizes });
  } catch (e) {
    return res.status(500).json({ response: e.message });
  }
};
module.exports.getQuizById = async (req, res) => {
  try {
    let selectStr = "-questions.answer";
    if (req.user && req.user.role === "ADMIN") {
      selectStr = "";
    }
    const { id } = req.params;
    const quiz = await Quiz.findById(id).select(selectStr);
    return res.status(200).json({ response: quiz });
  } catch (e) {
    console.log(e);
  }
};
module.exports.getQuizAnswersById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    return res.status(200).json({ response: quiz });
  } catch (e) {
    console.log(e);
  }
};
module.exports.getQuizesByCategory = async (req, res) => {
  try {
    const { id: category } = req.params;
    const quizes = await Quiz.find({ category });
    return res.status(200).json({ response: quizes });
  } catch (e) {
    console.log(e);
  }
};
module.exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    if (!quiz) throw new Error("Some Error Occured");
    const quizes = await Quiz.find({});
    return res.status(201).json({ response: quizes });
  } catch (err) {
    if (err && err.errors) {
      let errors = Object.values(err.errors).map((el) => el.message);
      const message = errors.length > 0 ? errors.join("<br>") : errors[0];
      return res.status(400).json({ message });
    } else if (err && err.code === 11000 && err.keyValue) {
      const [field, value] = Object.entries(err.keyValue)[0] || [];
      const message = `${field} "${value}" already exists. Try with another title`;
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message: err.message });
  }
};
module.exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(400).json({ message: "Quiz not found" });
    }
    const deletedDoc = await Quiz.findOneAndDelete({ _id: id });
    if (!deletedDoc) throw new Error("Some Error Occured");
    return await this.getAllQuizes(req, res);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
module.exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updateObj = req.body;
    if (updateObj?.questions?.length) {
      updateObj.numberOfQuestions = updateObj.questions.length;
    }
    const updatedDoc = await Quiz.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) throw new Error("Some Error Occured");
    const quizes = await Quiz.find({});
    return res.status(201).json({ response: quizes });
  } catch (err) {
    if (err && err.errors) {
      let errors = Object.values(err.errors).map((el) => el.message);
      const message = errors.length > 0 ? errors.join("<br>") : errors[0];
      return res.status(400).json({ message });
    } else if (err && err.code === 11000 && err.keyValue) {
      const [field, value] = Object.entries(err.keyValue)[0] || [];
      const message = `${field} "${value}" already exists. Try with another Title`;
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message: err.message });
  }
};
