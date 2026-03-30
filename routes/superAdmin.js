const express = require("express");
const { createSuperAdmin } = require("../controller/superAdminController");

const routes = express().router;

routes.post("/setup/super-admin", createSuperAdmin);

module.exports = routes;
