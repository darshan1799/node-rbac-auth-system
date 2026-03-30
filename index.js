const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./db/connect");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const superAdmin = require("./routes/superAdmin");
const permissionRoute = require("./routes/permissionRoutes");
const roleRoute = require("./routes/roleRoutes");
const assignRoleRoute = require("./routes/assignRoleRoute");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api", authRoute);
app.use("/api/user", userRoute);

app.use("/api/admin", adminRoute);
app.use("/api", superAdmin);
app.use("/api", permissionRoute);
app.use("/api", roleRoute);
app.use("/api", assignRoleRoute);

app.listen(2000, () => {
  console.log("app started on 2000");
});
