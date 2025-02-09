const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const privatekey = process.env.jwtSecret;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ userId: this._id }, privatekey);
  return token;
};

module.exports = mongoose.model("User", UserSchema);
