const express = require("express");
const userModel = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const { auth } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");

const routes = express().router;

routes.get("/info", auth, authorize("admin"), async (req, res) => {
  try {
    const user = req?.user;
    const userInfo = await userModel
      .findOne({ _id: user.user_id })
      .select("-password");
    return res.status(200).json({ user: userInfo });
  } catch (err) {
    return res.status(400).json({ msg: "try again later!", err: err.message });
  }
});

module.exports = routes;
