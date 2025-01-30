const express = require("express");
const { getDocuments, createItem } = require("../controllers/factoryHandlers");
const router = express.Router();
const ProductModel = require("../models/productModel");
const isLoggedin = require("../middleware/isLoggedin");
const multer = require("multer");
const memoryStorage = multer.diskStorage({
  destination: "./staticFiles/productImages",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const fileEx = file.mimetype.split("/")[1];
    if (!["png", "jpg", "jpeg"].includes(fileEx)) {
      cb(new Error("file Extention Is Not Support!"), false);
    } else {
      cb(null, true);
    }
  },
});
const {
  getProduct,
  getAllProducts,
  deleteProduct,
  createProduct,
  getProductComments,
} = require("../controllers/productsController");
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
