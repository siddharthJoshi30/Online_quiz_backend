const mongoose = require("mongoose");

const duplicateQue = (arr = []) => {
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    const elArr = arr.filter((el) => el === element);
    if (elArr.length > 1) return false;
  }
  return true;
};
const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Question text is mandatory!"],
  },
  options: {
    type: [String],
    required: true,
    validate: function () {
      if (this?.options?.length <= 1) {
        throw new Error("Minimum 2 options required!");
      } else if (!this?.options?.every((opt) => opt || opt === 0)) {
        throw new Error("Empty options are not allowed!");
      } else if (!duplicateQue(this?.options)) {
        throw new Error("Options are not unique!");
      }
    },
  },
  answer: {
    type: String,
    required: [true, "Select answer"],
  },
});

module.exports = questionSchema;
