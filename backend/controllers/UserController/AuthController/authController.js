const jwt = require("jsonwebtoken");
const User = require("../../../models/UserModel/userModel");
const { promisify } = require("util");

module.exports.generateJwtToken = (id) => {
  return jwt.sign({ id }, "jwt scret");
};
module.exports.register = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid Input" });
    }
    const _user = await User.findOne({ username });
    if (_user) {
      return res
        .status(400)
        .json({ message: `${_user.username} already exist` });
    }
    const user = await User.create({ username, password });
    const token = this.generateJwtToken(user._id);
    res
      .status(201)
      .json({ response: { ...user.toObject(), password: undefined, token } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ response: err.message });
  }
};
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid Input" });
    }
    const user = await User.findOne({ username }).select("+password");
    if (
      !user ||
      (user && !(await user.comparePassword(password, user.password)))
    ) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = this.generateJwtToken(user._id);
    res
      .status(200)
      .json({ response: { ...user.toObject(), password: undefined, token } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ response: err.message });
  }
};
module.exports.authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    }
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ message: "Try again" });
    }
    const decodedToken = await promisify(jwt.verify)(token, "jwt scret");
    const decodedUser = await User.findById(decodedToken.id);
    if (!decodedUser) {
      return res.status(401).json({ message: "User not founds" });
    }
    req.user = decodedUser;
    next();
  } catch (e) {
    console.log(e.message);
    return res.status(401).json({ message: "Try again!" });
  }
};
module.exports.authorize = (role) => async (req, res, next) => {
  if (req.user.role.toUpperCase() !== role) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
};
