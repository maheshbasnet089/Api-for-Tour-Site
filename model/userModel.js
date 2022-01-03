const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

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
    validate: {
      //This only works on save and create !!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same !",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

module.exports = mongoose.model("User", userSchema);
