const express = require("express");
const connectDB = require("./db/connect");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const superAdmin = require("./routes/superAdmin");
const permissionRoute = require("./routes/permissionRoutes");
const roleRoute = require("./routes/roleRoutes");
const assignRoleRoute = require("./routes/assignRoleRoute");
const userActionRoute = require("./routes/userActionRoute");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

connectDB();
app.use(express.json());
app.use("/api", authRoute);
app.use("/api/user", userRoute);

app.use("/api/admin", adminRoute);
app.use("/api", superAdmin);
app.use("/api", permissionRoute);
app.use("/api", roleRoute);
app.use("/api", assignRoleRoute);
app.use("/api", userActionRoute);

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to Node RBAC Authentication API 🚀",
    description: "Role-Based Access Control system with JWT authentication",
    github: "https://github.com/darshan1799/node-rbac-auth-system",
  });
});

app.listen(2000, () => {
  console.log("app started on 2000");
});
