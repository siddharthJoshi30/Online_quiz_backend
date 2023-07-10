const Leaderboard = require("../../models/RankModel/rankModel");
const User = require("../../models/UserModel/userModel");

module.exports.getLeaderboard = async (req, res) => {
  try {
    const board = await Leaderboard.find({}).sort({ points: "desc" });
    return res.status(200).json({ response: board });
  } catch (err) {
    console.log(err);
  }
};
module.exports.updateLeaderboard = async (req, res) => {
  try {
    const { _id, points } = req.body;
    const user = await User.findById(_id);
    if (!user) {
      const userFilter = { user: _id };
      const userEntry = await Leaderboard.findOne(userFilter);
      if (userEntry) {
        await Leaderboard.deleteOne(userFilter);
      }
      return res.status(400).json({ message: "User not found" });
    }
    const userFilter = { user: _id };
    const userEntry = await Leaderboard.findOne(userFilter);
    if (!userEntry) {
      const addedEntry = await Leaderboard.create({ user: _id, points });
      if (!addedEntry) throw new Error("Can't add user");
      const board = await Leaderboard.find({});
      return res.status(200).json({ response: board });
    }
    const updatedEntry = await Leaderboard.findOneAndUpdate(
      userFilter,
      { $inc: { points } },
      { new: true, runValidators: true }
    );
    if (!updatedEntry) throw new Error("Some Error occured!");
    this.getLeaderboard(req, res);
  } catch (err) {
    console.log(err);
  }
};
