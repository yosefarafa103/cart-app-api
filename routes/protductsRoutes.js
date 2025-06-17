const express = require("express");
const { getDocuments, createItem } = require("../controllers/factoryHandlers");
const router = express.Router();
const upload = require("../lib/multer");
const {
  getProduct,
  getAllProducts,
  deleteProduct,
  createProduct,
  getProductComments,
} = require("../controllers/productsController");
// router.use(isLoggedin);
router
  .route("/")
  .get(getAllProducts)
  .post(
    upload.fields([
      {
        name: "images",
        maxCount: 3,
      },
    ]),
    createProduct
  );
router.route("/:productId").get(getProduct).delete(deleteProduct);
router.route("/:productId/comments").get(getProductComments);
module.exports = router;
