const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  { 
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    confirmPassword: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (value) {
      //     return value === this.password;  
      //   },
      //   message: "Passwords do not match!"
      // }
    },
    userType: {
      type: String,
      required: true,
      enum: ["Volunteer", "Disabled"],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);