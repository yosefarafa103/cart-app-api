const express = require("express");
const app = express();
const usersRouter = require("./routes/userRoute");
const mongoose = require("mongoose");
const { globalErrorMiddleWare } = require("./Errors");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const port = 5001;
const commentRoute = require("./routes/commentRoute");
const dotenv = require("dotenv");
const helmet = require("helmet");
const path = require("path");
const cookieParser = require("cookie-parser");
const bookingRoute = require("./routes/bookingRoute");
dotenv.config();
const db = process.env.DB.replace("<db_password>", process.env.DB_PASS);
const productsRouter = require("./routes/protductsRoutes");
// Requests Limiter
app.use(cookieParser());
require("./lib/redis");
const message = {
  status: "error",
  message: "too many requests! try again later",
};
// Setting HTTPS Secure Headers
app.set("trust proxy", 1);
app.use((req, res, next) => {
  console.log(`Your Ip Is: ${req.ip}`);
  next();
});

const rLimiter = rateLimiter({
  httpOnly: true,
  windowMs: 60 * 1000 * 10, // for 10 mins
  limit: 3,
  message,
});

app.use(express.static(path.join(__dirname, "staticFiles")));

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: "*" }));
// app.use(rLimiter);
// ROUTES
app.use("/users", usersRouter);
app.use("/comments", commentRoute);
app.use("/booking", bookingRoute);
app.use("/products", productsRouter);

// final middleware to handel undefined routes

app.all("*", (req, res) => {
  return res.status(404).json({
    status: "Error",
    message: `page ${req.originalUrl} is not found ❌`,
  });
});

// CONNECTION TO DB

mongoose
  .connect(db)
  .then(() => console.log("Connected to database succesfull! ✅"))
  .catch((err) =>
    console.log("field to connect to database ❌", err.name + " " + err.message)
  );
app.use(globalErrorMiddleWare);
app.listen(port, () => console.log("Listening Port ", port));
process.on("unhandledRejection", (err) =>
  console.log(`err: ${err.name} ${err.message}`)
);
