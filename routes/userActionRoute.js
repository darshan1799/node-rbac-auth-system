const express = require("express");
const router = express.Router();

const requirePermission = require("../middleware/requirePermission");

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const { auth } = require("../middleware/auth");

router.post("/users", auth, requirePermission("create_user"), createUser);

router.get("/users", auth, requirePermission("view_user"), getUsers);

router.put("/users/:id", auth, requirePermission("update_user"), updateUser);

router.delete("/users/:id", auth, requirePermission("delete_user"), deleteUser);

module.exports = router;
