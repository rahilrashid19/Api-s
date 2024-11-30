const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const { RequestModel } = require("../models/requestModel");
const { User } = require("../models/user");

const connectionRouter = express.Router();

connectionRouter.get("/api/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await RequestModel.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "gender",
        "bio",
        "age",
        "profilePicture",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "gender",
        "bio",
        "age",
        "profilePicture",
      ]);

    res.status(200).json({
      message: "Connections fetched successfully",
      connections,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// old version of feed api with issue
// connectionRouter.get("/api/feed", userAuth, async (req, res) => {
//   try {
//     const loggedInUser = req.user;
//     const requests = await RequestModel.find({}).select([
//       "fromUserId",
//       "toUserId",
//     ]);

//     const usersToIgnoreInFeed = new Set();
//     requests.forEach((connection) => {
//       usersToIgnoreInFeed.add(connection.toUserId.toString());
//       usersToIgnoreInFeed.add(connection.fromUserId.toString());
//     });

//     console.log(usersToIgnoreInFeed);

//     const feedUsers = await User.find({
//       $and: [
//         { _id: { $ne: loggedInUser._id } },
//         {
//           _id: { $nin: Array.from(usersToIgnoreInFeed) },
//         },
//       ],
//     });

//     console.log(feedUsers);

//     res.status(200).json({
//       message: "Feeds fetched successfully",
//       feedUsers,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: error.message,
//     });
//   }
// });

connectionRouter.get("/api/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Find all requests where the logged-in user is either sender or receiver
    const requests = await RequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select(["fromUserId", "toUserId"]);

    // Collect users to exclude from feed
    const usersToIgnoreInFeed = new Set();
    usersToIgnoreInFeed.add(loggedInUser._id.toString()); // Add logged in user

    requests.forEach((connection) => {
      usersToIgnoreInFeed.add(connection.toUserId.toString());
      usersToIgnoreInFeed.add(connection.fromUserId.toString());
    });

    // Find users who are not in the ignore list
    const feedUsers = await User.find({
      _id: { $nin: Array.from(usersToIgnoreInFeed) },
    });

    res.status(200).json({
      message: "Feeds fetched successfully",
      feedUsers,
    });
  } catch (error) {
    console.error("Feed fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch feed users",
      details: error.message,
    });
  }
});

module.exports = {
  connectionRouter,
};
