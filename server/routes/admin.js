const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middlewares/authMiddleware");
const {
  getAdminPage,
  loginAdmin,
  registerAdmin,
  getDashboard,
  getAddPost,
  createPost,
  getEditPost,
  editPost,
  deletePost,
  logoutAdmin,
} = require("../controllers/adminController");

//GET
//Admin -login page
router.get("/admin", getAdminPage);

//POST
//Admin- login
router.post("/admin", loginAdmin);

//POST
//Admin- register
router.post("/register", registerAdmin);

//GET
//Admin dashboard
router.get("/dashboard", authMiddleWare, getDashboard);

//GET
//admin - create new post
router.get("/add-post", authMiddleWare, getAddPost);

//POST
//admin - create new post
router.post("/add-post", authMiddleWare, createPost);

//GET
//admin - edit post
router.get("/edit-post/:id", authMiddleWare, getEditPost);

//PUT
//admin - edit post
router.put("/edit-post/:id", authMiddleWare, editPost);

//DELETE
//admin - delete post
router.delete("/delete-post/:id", authMiddleWare, deletePost);

//GET
//Admin- logout
router.get("/logout", logoutAdmin);

module.exports = router;
