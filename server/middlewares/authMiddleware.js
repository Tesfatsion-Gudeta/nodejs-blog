const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;
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

module.exports = authMiddleWare;
