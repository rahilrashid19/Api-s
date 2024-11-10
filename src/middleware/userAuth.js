const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("User not logged in");
    const { id } = jwt.verify(token, "EXPRESS@2024");
    const user = await User.findOne({ _id: id });
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  userAuth,
};
