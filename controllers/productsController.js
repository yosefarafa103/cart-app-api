const { default: axios } = require("axios");
const BookingModel = require("../models/bookingModel");
const Product = require("../models/productModel");
const { getItem } = require("./factoryHandlers");
const { createClient } = require("redis");
const Comment = require("../models/commentsModel");
const client = createClient();
client.connect();
const DEFAULT_EXPIRATION = 3600;
const createProduct = async (req, res, next) => {
  const { price, productName, images } = req.body;
  const product = await Product.create(req.body);
  let files = req.files || [];
  if (!price || !productName) {
    return next("please enter required fileds");
  }
  // Uploading Product Images...

  // if (files) {
  // product.images = files.images.map((img) => img.filename);
  // await product.save();
  // }
  res.status(201).json(product);
};
// Caching With Redis.
const getDataFromCache = async (key, res) => {
  if (await client.get(key)) {
    return res?.status(200).json(JSON.parse(await client.get(key)));
  }
};
const setCache = async (key, data) => {
  await client.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(data));
};
// Caching With Redis.
const getAllProducts = async (req, res, next) => {
  let documents = await Product.find({});
  await setCache("products", documents);
  if (!documents.length) {
    return next("no Products yet..!");
  }

  if (req.query.productName) {
    await getDataFromCache(
      `products?productName=${req.query.productName}`,
      res
    );
    documents = await Product.find({ productName: req.query.productName });
    if (!documents.length) {
      return next("no Products matches this query..!");
    }
    await setCache(`products?productName=${req.query.productName}`, documents);
  }
  return res.status(200).json({
    documentsLength: documents.length,
    documents,
  });
};
const deleteSingleResource = async (resource, id) => {
  await axios.delete(`http://localhost:5001/${resource}/${id}`);
};
const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next("not found product");
  const bookingsLinkedWithThisProduct = await BookingModel.find({
    productId: product._id,
  }).select("productId _id");
  const productComments = await Comment.find({ product: product.id });
  await Promise.all(
    productComments.map(async (item) => {
      await deleteSingleResource("comments", item._id);
    })
  );
  if (!bookingsLinkedWithThisProduct.length) {
    // no bookings for this product!, then delete only product.
    // return next("no bookings for this product!");
    await Product.findByIdAndDelete(product._id);
    return res.status(204).send("deleted!");
  }
  await Promise.all(
    bookingsLinkedWithThisProduct.map(async (booking) => {
      await axios.delete(`http://localhost:5001/booking/${booking._id}`);
    })
  );
  await Product.findByIdAndDelete(product._id);
  res.status(204).json({
    status: "sucess",
    message: "deleted Product And There Bookings",
  });
};
const getProductComments = async (req, res, next) => {
  const productComments = Comment.aggregate([
    { $match: { product: req.params.productId } },
    {
      $group: {
        _id: "$product",
      },
    },
  ]);

  res.json(productComments);
};
const getProduct = async (req, res, next) => {
  try {
    // await getUserFromCache(`product_${req.params.productId}`, res);
    const product = await Product.findById(req.params.productId);
    if (!product) return next("not found product");
    // await client.set(`products_${product._id}`, JSON.stringify(product));
    // setCache(`product_${req.params.productId}`, JSON.stringify(product));
    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getProductComments,
  getProduct,
  getAllProducts,
  deleteProduct,
  createProduct,
};
