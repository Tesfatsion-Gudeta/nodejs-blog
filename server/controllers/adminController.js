const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const adminLayout = "../views/layouts/admin";

exports.getAdminPage = async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "simple blog created with nodejs,express and mongodb.",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
};

exports.loginAdmin = async (req, res) => {
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
};

exports.registerAdmin = async (req, res) => {
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
};

exports.getDashboard = async (req, res) => {
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
};

exports.getAddPost = async (req, res) => {
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
};

exports.createPost = async (req, res) => {
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
};

exports.getEditPost = async (req, res) => {
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
};

exports.editPost = async (req, res) => {
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
};

exports.deletePost = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

exports.logoutAdmin = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};
