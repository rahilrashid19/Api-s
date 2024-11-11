const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const { User } = require("../models/user");
const { RequestModel } = require("../models/requestModel");
const requestRouter = express.Router();

requestRouter.post(
  "/api/sendRequest/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const { toUserId, status } = req.params;
      const fromUserId = user._id;
      if (status !== "interested" && status !== "ignored") {
        return res.status(401).json({
          message: "Invalid Status",
        });
      }

      if (user._id.equals(toUserId)) {
        return res.status(401).json({
          message: "Can't send request to yourself",
        });
      }

      const userExists = await User.find({ _id: user._id });
      if (!userExists) {
        return res.status(401).json({
          message: "User does not exist",
        });
      }

      const requestExists = await RequestModel.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (requestExists) {
        return res.status(401).json({
          message: "Request already exists",
        });
      }
      const request = new RequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await request.save();
      res.status(201).json({
        message: "Connection Request Sent Successfully",
        request,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
);

requestRouter.post(
  "/api/reviewRequest/:status/:toRequestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toRequestId } = req.params;
      const loggedInUser = req.user;
      if (status !== "accepted" && status !== "rejected") {
        return res.status(401).json({
          message: "Invalid Status",
        });
      }
      const requests = await RequestModel.findOne({
        status: "interested",
        _id: toRequestId,
        toUserId: loggedInUser._id,
      })
        .populate("fromUserId", ["firstName", "lastName", "email"])
        .populate("toUserId", ["firstName", "lastName", "email"]);

      if (!requests) {
        return res.status(404).json({
          message: "Invalid connection request",
        });
      }

      requests.status = status;
      await requests.save();
      res.status(201).json({
        message: "Request Review",
        requests,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
);

module.exports = {
  requestRouter,
};
