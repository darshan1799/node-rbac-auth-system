const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const { roleSchema, assignPermissionSchema } = require("../utils/roleSchema");
const { default: mongoose } = require("mongoose");

exports.createRole = async (req, res) => {
  try {
    const parsed = roleSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((e) => {
          return { name: e.path.join(""), err: e.message };
        }),
      });
    }

    const { name } = parsed.data;

    const exists = await Role.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: "Role already exists" });
    }

    const role = await Role.create({ name });

    res.status(201).json({
      message: "Role created successfully",
      data: role,
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions", "name code").lean();

    res.status(200).json({
      count: roles.length,
      data: roles,
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.assignPermissionsToRole = async (req, res) => {
  try {
    const parsed = assignPermissionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((e) => {
          return { name: e.path.join(""), err: e.message };
        }),
      });
    }

    const { permissions } = parsed.data;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: "invalid id!" });
    }

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    permissions.map((permission) => {
      if (!mongoose.isValidObjectId(permission)) {
        return res.status(400).json({ msg: "some permission id is invalid!" });
      }
    });
    const validPermissions = await Permission.find({
      _id: { $in: permissions },
    });

    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({
        message: "Some permissions are invalid",
      });
    }

    role.permissions = permissions;
    await role.save();

    res.status(200).json({
      message: "Permissions assigned successfully",
      data: role,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error", err: e.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: "invalid id!" });
    }

    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (role.name === "Admin") {
      return res.status(400).json({
        message: "Cannot delete Admin role",
      });
    }

    await role.deleteOne();

    res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};
