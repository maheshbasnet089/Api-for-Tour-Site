const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const { randomBytes, createHash } = require("crypto");

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
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "A user must have a password "],
    minlength: 8,
    select: false,
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresIn: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (tokenCreatedDate) {
  if (this.passwordChangedAt) {
    const getTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return getTimeStamp > tokenCreatedDate;
  }
  //false means password is not changet at all
  return false;
};

userSchema.methods.createResetToken = function () {
  const resetToken = randomBytes(32).toString("hex");

  this.passwordResetToken = createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // console.log(resetToken, this.passwordResetToken);
  this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
