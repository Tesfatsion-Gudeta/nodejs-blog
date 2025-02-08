const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;
const Post = require("../models/Post");

const adminLayout = "../views/layouts/admin";

const authMiddleWare = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "unauthorized" });
  }
};

//GET
//Admin -login page
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "simple blog created with nodejs,express and mongodb.",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//POST
//Admin- check login

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials." });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Credentials." });
    }

    const token = user.generateAuthToken();
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//POST
//Admin- register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        username: username,
        password: hashedPassword,
      });

      res.status(201).json({ message: "user created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: "user already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unexpected server error" });
  }
});

//GET
//Admin dashboard
router.get("/dashboard", authMiddleWare, async (req, res) => {
  try {
    const data = await Post.find();

    const locals = {
      title: "Dashboard",
      description: "simple blog created with nodejs,express and mongodb.",
    };
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//GET
//admin - create new post
router.get("/add-post", authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "simple blog created with nodejs,express and mongodb.",
    };
    res.render("admin/dashboard", {
      locals,

      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//implement pagination for the admin dashboard

module.exports = router;
