require("dotenv").config();
const mongoose = require("mongoose");

// DB Config
const db = require("./keys.js").mongoURI;

function connectDB() {
  //Database connection
  mongoose.connect(db, { useNewUrlParser: true });
  const connection = mongoose.connection;
  connection
    .once("open", () => {
      console.log("Database connected");
    })
    .on("error", function (err) {
      console.log("Database connection failed", err);
    });
}

module.exports = connectDB;
