require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");

const connectDB = require("./server/config/db.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

//connecting to db
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: new Date(Date.now() + 3600000) },
  })
);

//templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main.js"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
