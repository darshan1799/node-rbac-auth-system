const userModel = require("../models/userModel");

const requirePermission = (permissionCode) => {
  return async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user.user_id).populate({
        path: "role",
        populate: { path: "permissions" },
      });

      if (!user || !user.role) {
        return res.status(403).json({ message: "Access denied" });
      }

      const hasPermission = user.role.permissions.some(
        (perm) => perm.code === permissionCode,
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Permission denied" });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};

module.exports = requirePermission;
