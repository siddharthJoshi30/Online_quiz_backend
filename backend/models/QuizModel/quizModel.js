const mongoose = require("mongoose");
const questionSchema = require("../QuestionModel/questionModel");
const Question = mongoose.model("Question", questionSchema);
const quizSchema = require("../DetailsModel/detailsModel");

quizSchema.virtual("totalPoints").get(function () {
  return this.numberOfQuestions * this.pointsPerQuestion;
});
quizSchema.pre(/^find$/, function (next) {
  this.select("-questions");
  next();
});
const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = {
  Question,
  Quiz,
};
