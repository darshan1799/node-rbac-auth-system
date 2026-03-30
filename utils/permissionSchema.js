// validations/permissionSchema.js
const { z } = require("zod");

const permissionSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),

  code: z
    .string()
    .min(1, "Code is required")
    .trim()
    .toLowerCase()
    .regex(/^[a-z_]+$/, "Code must be lowercase with underscores only"),
});

module.exports = permissionSchema;
