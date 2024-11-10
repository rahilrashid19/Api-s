const express = require("express");
const { User } = require("../models/user");
const { userAuth } = require("../middleware/userAuth");
const userRouter = express.Router();
const { validatePatchApi } = require("../validators/validations");

userRouter.get("/api/getAllUsers", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

userRouter.get("/api/viewProfile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

userRouter.patch("/api/editProfile", userAuth, (req, res) => {
  try {
    if (!validatePatchApi(req)) {
      throw new Error("Trying to update wrong fields");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    loggedInUser.save();
    res.status(200).json({
      message: "User profile updated successfully",
      loggedInUser,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = {
  userRouter,
};
