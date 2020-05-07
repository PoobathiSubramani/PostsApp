const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user")

const app = express();

mongoose
  .connect(
    "mongodb+srv://dbuser:dbpwd09@boomongocluster-rcqr2.azure.mongodb.net/node-angular?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true} //added as per deprication warnings
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("DB Connection failed!");
  });



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
