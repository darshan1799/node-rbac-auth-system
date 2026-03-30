const { z } = require("zod");

const roleSchema = z.object({
  name: z.string().min(1).trim(),
});

const assignPermissionSchema = z.object({
  permissions: z.array(z.string().min(1)),
});

module.exports = { roleSchema, assignPermissionSchema };
