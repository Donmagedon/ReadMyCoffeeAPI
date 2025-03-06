require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const generate_coffee = require("./routes/generate_coffee");
const questions = require("./routes/questions");
const bodyParser = require('body-parser')

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.json())
app.use("/api/generate_coffee", generate_coffee);
app.use("/api/questions", questions);
app.listen(3030, () => {
  console.log("I'm alive!");
});
