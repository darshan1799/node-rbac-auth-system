const express = require("express");
const { auth } = require("../middleware/auth");
const userModel = require("../models/userModel");

const routes = express().router;

routes.get("/info", auth, async (req, res) => {
  try {
    const user = req?.user;
    const userInfo = await userModel
      .findOne({ _id: user.user_id })
      .populate({
        path: "role",
        select: "name",
        populate: {
          path: "permissions",
          select: "name code",
        },
      })
      .select("-password")
      .lean();

    return res.status(200).json({ user: userInfo });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "internal server error", err: err.message });
  }
});

module.exports = routes;
