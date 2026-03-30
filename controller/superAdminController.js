const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const roleModel = require("../models/roleModel");

exports.createSuperAdmin = async (req, res) => {
  try {
    const { name, email, password, secret } = req.body;

    if (secret !== process.env.SUPER_ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid secret code" });
    }

    let existingAdmin = null;
    const existingRole = await roleModel.findOne({ name: "Super Admin" });
    if (existingRole) {
      existingAdmin = await User.findOne({ role: existingRole?._id });
    }

    console.log(existingRole, existingAdmin);

    if (existingAdmin && existingAdmin.role.equals(existingRole._id)) {
      return res.status(400).json({
        message: "Super admin already exists",
      });
    }

    const permissionsData = [
      { name: "Create User", code: "create_user" },
      { name: "Delete User", code: "delete_user" },
      { name: "Update User", code: "update_user" },
      { name: "View User", code: "view_user" },
      { name: "Manage Roles", code: "manage_roles" },
      { name: "Manage Permission", code: "manage_permission" },
    ];

    const existingPermissions = await Permission.find();
    const existingCodes = existingPermissions.map((p) => p.code);

    const newPermissions = permissionsData.filter(
      (p) => !existingCodes.includes(p.code),
    );

    if (newPermissions.length > 0) {
      await Permission.insertMany(newPermissions);
    }

    const allPermissions = await Permission.find();

    let adminRole = await Role.findOne({ name: "Super Admin" });

    if (!adminRole) {
      adminRole = await Role.create({
        name: "Super Admin",
        permissions: allPermissions.map((p) => p._id),
      });
    } else {
      adminRole.permissions = allPermissions.map((p) => p._id);
      await adminRole.save();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: adminRole._id,
    });

    res.status(201).json({
      message: "Super Admin created with full permissions",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
