const mongoose = require("mongoose");

function db() {
  return mongoose.connect("mongodb://0.0.0.0:27017/takequiz", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
module.exports = db;
