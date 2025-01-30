const stripe = require("stripe");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const factoryController = require("./factoryHandlers");
const BookingModel = require("../models/bookingModel");
const client = require("redis").createClient();
const DEFAULT_EXPIRATION = 3600;
client.connect();
const getUserFromCache = async (key, res) => {
  if (await client.get(key)) {
    res?.status(200)?.json(JSON.parse(await client.get(key)));
    return;
  }
};
const setCache = (key, data) => {
  client.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(data));
};
exports.getCheckoutSession = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const price = 120;
  const purchaseSession = await stripe(
    process.env.STRPIE_SECRET_KEY
  ).checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/?price=${price}&user=${
      user._id
    }`,
    cancel_url: `${req.protocol}://${req.get("host")}/error.html`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: price * 100,
          product_data: {
            name: `${user.name}`,
            description: "abcde",
            images: [`http://localhost:5001/imgs/${user.photo}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  // res.locals.session = purchaseSession.url;
  res.status(200).json({
    session: purchaseSession.url,
  });
};
exports.createBookingCheckout = async (req, res, next) => {
  const { price, user } = req.query;

  if (!price && !user) {
    // checkout
    return next();
  }
  const userBooked = await User.findById(user);
  await Booking.create({
    productId: user,
    userBooked: user,
    price,
  });
};
exports.getsUserBooking = async (req, res, next) => {
  const currentBookings = await Booking.find({
    bookedProduct: req.params.userId,
  })
    // .select("productId")
    .populate("productId");
  res.status(200).json(currentBookings);
};
exports.createBooking = factoryController.createItem(Booking, true);
exports.deleteBooking = factoryController.deleteDocument(Booking);
exports.updateBooking = factoryController.updateDocument(Booking);
exports.getBooking = factoryController.getItem(Booking);
exports.getAllBookings = async (req, res, next) => {
  const { _id } = req.filter;
  const bookingCache = await getUserFromCache("bookings", res);
  if (bookingCache) return bookingCache;
  let documents = await BookingModel.find();
  setCache("bookings", documents);
  if (!documents.length) {
    return next("no bookings yet..!");
  }
  res.status(200).json({
    documentsLength: documents.length,
    documents,
  });
};
// factoryController.getDocuments(Booking, "", true);
// 673ef333b735f7d6c48615c3
