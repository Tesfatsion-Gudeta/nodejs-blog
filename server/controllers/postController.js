const Post = require("../models/Post");

exports.getHomePage = async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "simple blog created with nodejs,express and mongodb",
    };

    let perPage = 5;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getPost = async (req, res) => {
  try {
    const slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "simple blog created with nodeJs, Express and MongoDb",
    };
    res.render("post", {
      locals,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.searchPost = async (req, res) => {
  try {
    const locals = {
      title: "search",
      description: "simple blog created with nodeJs, Express and MongoDb",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      //$or= match atleast one of this conditions
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } }, //$regex = MongoDB operator that allows pattern matching ,i : for case insensitive matching
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", {
      data,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAboutPage = (req, res) => {
  res.render("about");
};

exports.getContactPage = (req, res) => {
  res.render("contact");
};
