const Role = require("../models/roleModel");
const assignRoleSchema = require("../utils/userRoleSchema");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const { userSchemaZ, updateUserSchema } = require("../utils/userSchema");
const userModel = require("../models/userModel");

exports.assignRoleToUser = async (req, res) => {
  try {
    const parsed = assignRoleSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((e) => {
          return { name: e.path.join(""), err: e.message };
        }),
      });
    }

    const { roleId } = parsed.data;
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(roleId)) {
      return res.status(400).json({ msg: "invalid id!" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ msg: "invalid id!" });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = roleId;
    await user.save();

    res.status(200).json({
      message: "Role assigned successfully",
      data: {
        userId: user._id,
        role: role.name,
      },
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const parsed = userSchemaZ.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((e) => {
          return { name: e.path.join(""), err: e.message };
        }),
      });
    }

    const { name, email, password } = parsed.data;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    let defaultRole = await Role.findOne({ name: "User" });
    if (!defaultRole) {
      defaultRole = await Role.create({ name: "User" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: defaultRole?._id || null,
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "User created successfully",
      data: userObj,
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel
      .find()
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

    res.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", err: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const parsed = updateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((e) => {
          return { name: e.path.join(""), err: e.message };
        }),
      });
    }

    const updateData = parsed.data;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: "invalid id!" });
    }

    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (updateData.email) {
      const exists = await userModel.findOne({
        email: updateData.email,
        _id: { $ne: req.params.id },
      });

      if (exists) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    Object.assign(user, updateData);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: "User updated successfully",
      data: userObj,
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: "invalid id!" });
    }
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message: "You cannot delete yourself",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};
