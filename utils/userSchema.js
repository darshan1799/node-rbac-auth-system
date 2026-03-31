const z = require("zod");
const userSchemaZ = z.object({
  name: z.string().min(3).max(20),
  email: z.email(""),
  password: z.string().min(6).max(10),
  role: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

module.exports = { userSchemaZ, updateUserSchema };
