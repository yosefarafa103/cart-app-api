const express = require("express");
const {
  updateComment,
  deleteComment,
  getProdutComments,
  createComment,
  getSingleComment,
} = require("../controllers/commentController");
const Comment = require("./../models/commentsModel");
const {
  deleteDocuments,
  getDocuments,
} = require("../controllers/factoryHandlers");
const router = express.Router({ mergeParams: true });
const isLoggedIn = require("../middleware/isLoggedin");
// router.use(isLoggedIn);
router
  .route("/:id")
  .patch(updateComment)
  .get(getSingleComment)
  .delete(deleteComment);
router
  .route("/")
  .post(createComment)
  .get(getDocuments(Comment))
  .delete(deleteDocuments(Comment));

router.route("/product/:productId").get(getProdutComments).post(createComment);
module.exports = router;
