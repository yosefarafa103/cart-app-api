const axios = require("axios");
const Comment = require("../models/commentsModel");
const User = require("../models/userModel");

const { getDocuments, updateDocument } = require("./factoryHandlers");
const Product = require("../models/productModel");

const getProdutComments = async (req, res, next) => {
  const product = await Comment.find({ product: req.params.productId });
  // req.params.productId;
  res.status(200).json(product);
};
const getSingleComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  res.status(200).json(comment);
};
const getComments = getDocuments(Comment);
const createComment = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    // commentedBy: req.body.publishedBy,
    await product.save();
    console.lg(product.commentedBy.indexOf(req.body.publishedBy));
    if (product.commentedBy.indexOf(req.body.publishedBy) === -1) {
      product.commentedBy.push(req.body.publishedBy);
      const document = await Comment.create(req.body);
      product.comments.push(document?._id);
      await product.save();
      res.status(201).json(document);
    } else {
      return next("can't create comment!");
    }
    // await document.save();
  } catch (err) {
    return next(err);
  }
};
const postNewComment = async (req, res, next) => {
  const comment = await Comment.create(req.body);
  comment.commentBy = req.params.id;
  await comment.save();
  res.status(201).json(comment);
};
const updateComment = updateDocument(Comment);
const deleteComment = async (req, res, next) => {
  const userDeleted = await Comment.findById(req.params.id);
  await Comment.deleteOne({ _id: req.params.id });
  const newDets = await Comment.aggregate([
    {
      $match: {
        commentBy: userDeleted.commentBy,
      },
    },
    {
      $group: {
        _id: "$commentBy",
        commentCount: { $sum: 1 },
      },
    },
  ]);
  await User.findOneAndUpdate(userDeleted.commentBy, {
    numberOfComments: newDets[0].commentCount,
  });
  res.send(".");
};

module.exports = {
  createComment,
  getComments,
  postNewComment,
  getSingleComment,
  updateComment,
  deleteComment,
  getProdutComments,
};
