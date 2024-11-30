const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpApi } = require("../validators/validations");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

authRouter.post("/api/signup", async (req, res) => {
  try {
    validateSignUpApi(req);
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      age,
      bio,
      profilePicture,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      gender,
      age,
      bio,
      profilePicture,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      message: "User saved successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

authRouter.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const isPasswordmatching = await bcrypt.compare(password, user.password);
    if (!isPasswordmatching) {
      throw new Error("Invalid Credentials");
    }
    const token = jwt.sign({ id: user._id }, "EXPRESS@2024", {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.status(200).json({
      message: "User Logged in successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

authRouter.post("/api/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).json({
    message: "User logged out successfully",
  });
});

module.exports = {
  authRouter,
};
