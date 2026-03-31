const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL_ATLAS);
    console.log("Db Connected!");
  } catch (e) {
    console.log("error: " + e.message);
    process.exit(1); // important
  }
};

module.exports = connectDB;
