const express = require("express");
const router = express.Router();

const {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission,
} = require("../controller/permissionController");

const requirePermission = require("../middleware/requirePermission");
const { auth } = require("../middleware/auth");

// 🔐 Only users with manage_permission can access

router.post(
  "/permissions",
  auth,
  requirePermission("manage_permission"),
  createPermission,
);

router.get(
  "/permissions",
  auth,
  requirePermission("manage_permission"),
  getPermissions,
);

router.put(
  "/permissions/:id",
  auth,
  requirePermission("manage_permission"),
  updatePermission,
);

router.delete(
  "/permissions/:id",
  auth,
  requirePermission("manage_permission"),
  deletePermission,
);

module.exports = router;
