const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
      required: [true, "Valid email is required!"],
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is mandatory"],
    },
    role: {
      type: String,
      enum: ["ADMIN", ""],
      default: "",
      select: true,
    },
    completed: [
      {
        id: {
          type: mongoose.Schema.ObjectId,
          ref: "Quiz",
        },
        points: Number,
        questions: {
          type: [Object],
        },
      },
    ],
  },
  {
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
  }
);
userSchema.methods.comparePassword = async function (password, actualPassword) {
  return await bcrypt.compare(password, actualPassword);
};
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const SALT_ROUNDS = 8;
  this.password = bcrypt.hashSync(this.password, SALT_ROUNDS);
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
