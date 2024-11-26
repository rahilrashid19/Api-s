const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 10,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Others"],
        message: "{VALUE} is not a valid gender",
      },
    },
    age: {
      type: Number,
    },
    bio: {
      type: String,
      default: "Employee at Dunder Mifflin",
    },
    company: {
      type: String,
      default: "Dunder Mifflin Paper Company",
    },
    skills: {
      type: [String],
    },
    profilePicture: {
      type: String,
      default:
        "https://www.istockphoto.com/vector/profile-picture-vector-illustration-gm587805156-100912283",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};
