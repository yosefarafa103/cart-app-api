const { Schema, model } = require("mongoose");
// const Product
const bookingSchema = new Schema({
  productId: {
    type: Schema.ObjectId,
    required: [true, "must have ID to Make Booking!"],
    ref: "Product",
  },
  price: { type: Number, required: [true, "must have Price to Make Booking!"] },
  bookedProduct: {
    type: Schema.ObjectId,
    required: [true, "You must have login to purchase"],
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "delivered", "shipped"],
    default: "pending",
  },
});
bookingSchema.pre(/find/, function (next) {
  this.populate("productId");
  next();
});
const BookingModel = new model("Booking", bookingSchema);

module.exports = BookingModel;
