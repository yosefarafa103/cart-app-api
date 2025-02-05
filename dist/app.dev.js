"use strict";

var express = require("express");

var app = express();

var usersRouter = require("./routes/userRoute");

var mongoose = require("mongoose");

var morgan = require("morgan");

var _require = require("./Errors"),
    globalErrorMiddleWare = _require.globalErrorMiddleWare;

var cors = require("cors");

var rateLimiter = require("express-rate-limit");

var port = 5001;

var commentRoute = require("./routes/commentRoute");

var dotenv = require("dotenv");

var helmet = require("helmet");

var path = require("path");

var cookieParser = require("cookie-parser");

var bookingRoute = require("./routes/bookingRoute");

dotenv.config();
var db = process.env.DB.replace("<db_password>", process.env.DB_PASS);

var productsRouter = require("./routes/protductsRoutes"); // Requests Limiter


app.use(cookieParser());
var message = {
  status: "error",
  message: "too many requests! try again later"
}; // Setting HTTPS Secure Headers

var rLimiter = rateLimiter({
  httpOnly: true,
  windowMs: 60 * 1000 * 0,
  // for 0 hour
  limit: 150,
  message: message
});
app.use(express["static"](path.join(__dirname, "staticFiles"))); // Middlewares

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "*"
}));
app.use(morgan("dev"));
app.use(rLimiter); // ROUTES

app.use("/users", usersRouter);
app.use("/comments", commentRoute);
app.use("/booking", bookingRoute);
app.use("/products", productsRouter); // final middleware to handel undefined routes

app.all("*", function (req, res) {
  return res.status(404).json({
    status: "Error",
    message: "page ".concat(req.originalUrl, " is not found \u274C")
  });
}); // CONNECTION TO DB

mongoose.connect(db).then(function () {
  return console.log("Connected to database succesfull! ✅");
})["catch"](function (err) {
  return console.log("field to connect to database ❌", err.name + " " + err.message);
});
app.use(globalErrorMiddleWare);
app.listen(port, function () {
  return console.log("Listening Port ", port);
});
process.on("unhandledRejection", function (err) {
  return console.log("err: ".concat(err.name, " ").concat(err.message));
});