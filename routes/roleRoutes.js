const express = require("express");
const router = express.Router();

const {
  createRole,
  getRoles,
  assignPermissionsToRole,
  deleteRole,
} = require("../controller/roleController");

const requirePermission = require("../middleware/requirePermission");
const { auth } = require("../middleware/auth");

router.post("/roles", auth, requirePermission("manage_roles"), createRole);

router.get("/roles", auth, requirePermission("manage_roles"), getRoles);

router.patch(
  "/roles/:id/permissions",
  auth,
  requirePermission("manage_roles"),
  assignPermissionsToRole,
);

router.delete(
  "/roles/:id",
  auth,
  requirePermission("manage_roles"),
  deleteRole,
);

module.exports = router;
