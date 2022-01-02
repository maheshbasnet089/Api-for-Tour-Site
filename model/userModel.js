const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a correct email"],
    unique: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, "A user must have a password "],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
});

module.exports = mongoose.model("User", userSchema);
