const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL_ATLAS)
  .then(() => {
    console.log("Db Connected!");
  })
  .catch((e) => {
    console.log("error:" + e.message);
  });
