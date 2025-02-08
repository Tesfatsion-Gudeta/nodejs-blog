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
    res.render("admin/add-post", {
      locals,

      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//POST
//admin - create new post
router.post("/add-post", authMiddleWare, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
    });

    await Post.create(newPost);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//GET
//admin - edit post
router.get("/edit-post/:id", authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Nodejs project",
    };
    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//PUT
//admin - edit post
router.put("/edit-post/:id", authMiddleWare, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

//DELETE
//admin - delete post
router.delete("/delete-post/:id", authMiddleWare, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//GET
//Admin- logout

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

//implement pagination for the admin dashboard

module.exports = router;
