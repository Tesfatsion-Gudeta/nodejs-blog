const express = require("express");
const router = express.Router();
const User = require("../models/User");

const adminLayout = "../views/layouts/admin";

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
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
