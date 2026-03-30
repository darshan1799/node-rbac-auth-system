const { default: mongoose } = require("mongoose");
const permissionModel = require("../models/permissionModel");
const permissionSchema = require("../utils/permissionSchema");

exports.createPermission = async (req, res) => {
  try {
    const parsed = await permissionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((e) => {
          return { name: e.path.join(""), err: e.message };
        }),
      });
    }

    const { name, code } = parsed.data;

    const exists = await permissionModel.findOne({ code });
    if (exists) {
      return res.status(409).json({ message: "Permission already exists" });
    }

    const permission = await permissionModel.create({ name, code });

    res.status(201).json({
      message: "Permission created successfully",
      data: permission,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await permissionModel.find().lean();

    res.status(200).json({
      count: permissions.length,
      data: permissions,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const parsed = permissionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((e) => {
          return { name: e.path.join(""), err: e.message };
        }),
      });
    }

    const { name, code } = parsed.data;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: "invalid id!" });
    }

    const existing = await permissionModel.findOne({
      code,
      _id: { $ne: req.params.id },
    });

    if (existing) {
      return res.status(409).json({
        message: "Another permission with this code already exists",
      });
    }

    const updated = await permissionModel.findByIdAndUpdate(
      req.params.id,
      { name, code },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.status(200).json({
      message: "Permission updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: "invalid id!" });
    }
    const permission = await permissionModel.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    if (permission.code === "manage_permission") {
      return res.status(400).json({
        message: "Cannot delete critical permission",
      });
    }

    await permission.deleteOne();

    res.status(200).json({
      message: "Permission deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
