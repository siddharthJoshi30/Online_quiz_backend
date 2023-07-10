const mongoose = require("mongoose");
const questionSchema = require("../QuestionModel/questionModel");

const duplicateCheck = (arr = []) => {
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    const elArr = arr.filter((el) => el === element);
    if (elArr.length > 1) return false;
  }
  return true;
};
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Title required!"],
    },
    category: {
      type: String,
      required: [true, "Subject name required!"],
    },
    timeForQuiz: {
      type: Number,
      default: 5,
      validate: function () {
        if (this?.timeForQuiz < 1 || this?.timeForQuiz > 20) {
          throw new Error("Time must between 1 and 20!");
        }
      },
    },
    pointsPerQuestion: {
      type: Number,
      default: 50,
      validate: function () {
        if (this?.pointsPerQuestion < 5 || this?.pointsPerQuestion > 100) {
          throw new Error("Points must between 5 and 100!");
        }
      },
    },
    numberOfQuestions: {
      type: Number,
      default: function () {
        return this.parent()?.questions?.length || 0;
      },
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: function () {
        if (this?.questions?.length <= 0) {
          throw new Error("Minimum question should be 1 in quiz!");
        } else if (!duplicateCheck(this?.questions?.map((q) => q.text))) {
          throw new Error("Unique questions are required!");
        }
      },
    },
  },
  { toJSON: { versionKey: false, virtuals: true }, id: false }
);

module.exports = quizSchema;
