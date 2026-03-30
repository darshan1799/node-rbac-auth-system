const User = require("../models/userModel");
const Role = require("../models/roleModel");
const assignRoleSchema = require("../utils/userRoleSchema");
const { default: mongoose } = require("mongoose");

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

    const user = await User.findById(userId);
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
