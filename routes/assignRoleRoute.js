const express = require("express");
const router = express.Router();

const { assignRoleToUser } = require("../controller/userController");
const requirePermission = require("../middleware/requirePermission");
const { auth } = require("../middleware/auth");

router.patch(
  "/users/:id/role",
  auth,
  requirePermission("manage_roles"),
  assignRoleToUser,
);

module.exports = router;
