const { z } = require("zod");

const assignRoleSchema = z.object({
  roleId: z.string().min(1, "Role ID is required"),
});

module.exports = assignRoleSchema;
