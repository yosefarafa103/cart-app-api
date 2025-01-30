const { Schema, model } = require("mongoose");
const UserModel = require("./userModel");
const commentSchema = new Schema({
  text: {
    type: String,
    required: [true, "please enter your comment it's required field"],
  },
  rating: {
    type: Number,
    required: true,
    min: [1, "rate must be 1 to 5"],
    max: [5, "rate must be 5 or less"],
    set: (rate) => rate,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  product: {
    type: Schema.ObjectId,
    ref: "Product",
    required: [true, "provide product"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  publishedBy: {
    type: Schema.ObjectId,
    ref: UserModel,
    required: [true, "provide user he comment this"],
  },
});
// commentSchema.statics.getStatics = async function (userId) {
//   const result = await this.aggregate([
//     {
//       $match: { commentBy: userId },
//     },
//     {
//       $group: {
//         _id: "commentBy",
//         commentCount: { $sum: 1 },
//       },
//     },
//   ]);

//   await UserModel.findByIdAndUpdate(userId, {
//     numberOfComments: result[0].commentCount,
//   });
// };
commentSchema.pre(/^find/, function (next) {
  this.select("-__v");
  this.populate("publishedBy");
  next();
});
// commentSchema.pre(/^f indOneAnd/, async function (next) {
//   this.comm = this.findOne();
//   next();
// });
// commentSchema.post(/^findOneAnd/, function (doc) {
//   console.log(this.constructor);
// });

// commentSchema.post("save", function (doc) {
//   this.constructor.getStatics(doc.commentBy);
// });

const Comment = model("Comment", commentSchema);
module.exports = Comment;
