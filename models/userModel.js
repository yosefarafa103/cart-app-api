const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [
        true,
        "the account must be have name required and contains only characters!",
      ],
      minLength: [6, "your name must be 6 characters and more "],
      // validate: [validator.isAlpha, "enter your name present characters only!"],
    },
    email: {
      type: String,
      required: [true, "the account must be have email required!"],
      unique: true,
      validate: [validator.isEmail, "the email is not valid!"],
    },
    photo: {
      type: String,
      default:
        "staticFiles/the-new-york-public-library-IordXREq3vM-unsplash.jpg",
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must be 6 charcters or more!"],
    },
    confirmPassword: {
      type: String,
      required: [true, "please enter confirm password it's required"],
      validate: {
        validator: function (elment) {
          console.log(elment);
          return elment === this.password;
        },
        message: "Please Enter Correct Password!",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    changedPasswordAt: Date,
    isActiveAccount: {
      type: Boolean,
      default: true,
      select: false,
    },
    admins: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    numberOfComments: {
      type: Number,
      default: 0,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
userSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "commentBy",
  localField: "_id",
});
userSchema.pre("save", async function (n) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.confirmPassword = undefined;
  this.__v = undefined;
  n();
});
userSchema.pre("save", async function (nxt) {
  if (this.admins) {
    const adminUsers = this.admins.map(async (id) => await User.findById(id));
    this.admins = await Promise.all(adminUsers);
  }
  this.owner = this._id;
  nxt();
});
// userSchema.post("updateOne", function (next) {
//   next();
// });
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.updatedPasswordAt = Date.now();
  this.resetPasswordToken = undefined;
  this.confirmPassword = undefined;
  next();
});

// create generate random token
userSchema.methods.generateRestPasswordRandomToken = async function () {
  const { randomBytes, createHash } = crypto;
  const randomToken = randomBytes(32).toString("hex");
  this.resetPasswordToken = createHash("sha256")
    .update(randomToken)
    .digest("hex");
  // console.log(
  //   `unEncrypted: ${randomToken} `,
  //   "Encrypted: ",
  //   this.resetPasswordToken
  // );
  return randomToken;
};

userSchema.methods.isCorrectPassword = async (hashedPass, enteredPass) =>
  await bcrypt.compare(enteredPass, hashedPass);

// Pre-find Middlewares
userSchema.pre(/^find/, function (n) {
  this.select("-__v");
  this.find({
    isActiveAccount: {
      $ne: false,
    },
  });
  n();
});
const User = new model("User", userSchema);
module.exports = User;
