require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

//templating engine

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
