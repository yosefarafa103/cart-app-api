"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema,
    model = mongoose.model;

var validator = require("validator");

var crypto = require("crypto");

var bcrypt = require("bcryptjs");

var userSchema = new Schema({
  name: {
    type: String,
    required: [true, "the account must be have name required and contains only characters!"],
    minLength: [6, "your name must be 6 characters and more "] // validate: [validator.isAlpha, "enter your name present characters only!"],

  },
  email: {
    type: String,
    required: [true, "the account must be have email required!"],
    unique: true,
    validate: [validator.isEmail, "the email is not valid!"]
  },
  photo: {
    type: String,
    "default": "staticFiles/the-new-york-public-library-IordXREq3vM-unsplash.jpg"
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [6, "password must be 6 charcters or more!"]
  },
  confirmPassword: {
    type: String,
    required: [true, "please enter confirm password it's required"],
    validate: {
      validator: function validator(elment) {
        console.log(elment);
        return elment === this.password;
      },
      message: "Please Enter Correct Password!"
    }
  },
  role: {
    type: String,
    "enum": ["user", "admin", "moderator"],
    "default": "user"
  },
  resetPasswordToken: {
    type: String
  },
  changedPasswordAt: Date,
  isActiveAccount: {
    type: Boolean,
    "default": true,
    select: false
  },
  admins: [{
    type: Schema.ObjectId,
    ref: "User"
  }],
  numberOfComments: {
    type: Number,
    "default": 0
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
userSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "commentBy",
  localField: "_id"
});
userSchema.pre("save", function _callee(n) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(this.isModified("password") || this.isNew)) {
            _context.next = 4;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 10));

        case 3:
          this.password = _context.sent;

        case 4:
          this.confirmPassword = undefined;
          this.__v = undefined;
          n();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
userSchema.pre("save", function _callee3(nxt) {
  var adminUsers;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!this.admins) {
            _context3.next = 5;
            break;
          }

          adminUsers = this.admins.map(function _callee2(id) {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(User.findById(id));

                  case 2:
                    return _context2.abrupt("return", _context2.sent);

                  case 3:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });
          _context3.next = 4;
          return regeneratorRuntime.awrap(Promise.all(adminUsers));

        case 4:
          this.admins = _context3.sent;

        case 5:
          this.owner = this._id;
          nxt();

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  }, null, this);
}); // userSchema.post("updateOne", function (next) {
//   next();
// });

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.updatedPasswordAt = Date.now();
  this.resetPasswordToken = undefined;
  this.confirmPassword = undefined;
  next();
}); // create generate random token

userSchema.methods.generateRestPasswordRandomToken = function _callee4() {
  var randomBytes, createHash, randomToken;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          randomBytes = crypto.randomBytes, createHash = crypto.createHash;
          randomToken = randomBytes(32).toString("hex");
          this.resetPasswordToken = createHash("sha256").update(randomToken).digest("hex"); // console.log(
          //   `unEncrypted: ${randomToken} `,
          //   "Encrypted: ",
          //   this.resetPasswordToken
          // );

          return _context4.abrupt("return", randomToken);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  }, null, this);
};

userSchema.methods.isCorrectPassword = function _callee5(hashedPass, enteredPass) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(enteredPass, hashedPass));

        case 2:
          return _context5.abrupt("return", _context5.sent);

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // Pre-find Middlewares


userSchema.pre(/^find/, function (n) {
  this.select("-__v");
  this.find({
    isActiveAccount: {
      $ne: false
    }
  });
  n();
});
var User = new model("User", userSchema);
module.exports = User;