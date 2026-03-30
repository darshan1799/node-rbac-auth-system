const express = require("express");
const bcrypt = require("bcrypt");
const router = express().router;
const { userSchemaZ } = require("../utils/userSchema");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sessionModel = require("../models/sessionModel");
const { auth } = require("../middleware/auth");
const roleModel = require("../models/roleModel");

router.post("/register", async (req, res) => {
  try {
    const data = await req.body;
    const result = await userSchemaZ.safeParseAsync(data);
    if (result.error && result.error?.issues) {
      errors = result.error?.issues.map((err) => {
        return { field: err.path.join(""), msg: err.message };
      });
      return res.status(400).json({ msg: "validation error", error: errors });
    }

    const isExistEmail = await userModel.findOne({ email: result.data.email });
    if (isExistEmail) {
      return res.status(400).json({ msg: "email already exist!" });
    }

    try {
      result.data.password = await bcrypt.hash(result.data.password, 10);
    } catch (err) {
      return res.status(500).json({ msg: "internal server error" });
    }

    let isexist = await roleModel.findOne({ name: "User" });
    if (!isexist) {
      isexist = await roleModel.create({ name: "User" });
    }

    result.data.role = isexist._id;

    const user = new userModel(result.data);
    const save = await user.save();
    return res.status(201).json("user registered successfully!");
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "internal server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = await req.body;

    const isExistEmail = await userModel.findOne({
      email: data.email,
    });

    if (!isExistEmail) {
      return res.status(403).json({ msg: "user not registered!" });
    }

    const result = await bcrypt.compare(data.password, isExistEmail.password);

    if (!result) {
      return res.status(403).json({ msg: "invalid credentials" });
    }

    const session = await sessionModel.create({
      user_id: isExistEmail._id,
      user_agent: req?.headers["user-agent"],
      ip: req?.ip,
    });

    if (!session) {
      return res.status(500).json({ msg: "unable to create a session!" });
    }

    const refresh_token = jwt.sign(
      { session_id: session?._id },
      process.env.REFRESH_KEY,
      {
        expiresIn: "7d",
      },
    );

    const acess_token = jwt.sign(
      { user_id: isExistEmail._id, role: isExistEmail?.role ?? "user" },
      process.env.JWT_KEY,
      { expiresIn: "2h" },
    );

    res.cookie("acess_token", acess_token, {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json({ msg: "user login successfully!", data: isExistEmail });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "internal server error", error: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = req?.user;
    const userInfo = await userModel
      .findOne({ _id: user.user_id })
      .select("-password");
    return res.status(200).json({ user: userInfo });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "internal server error", err: err.message });
  }
});

module.exports = router;
