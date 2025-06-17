const express = require("express");
const {
  signin,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  deleteMyData,
  logout,
  updateUserPassword,
  blockUser,
} = require("../controllers/authController");
const commentRouter = require("./commentRoute");
const {
  getAllUsers,
  deleteUser,
  deleteAllUsers,
  getSingleUser,
} = require("../handlers");
const UserModel = require("./../models/userModel");
const validationToken = require("../middleware/validateToken");
const generateToken = require("../utils/generateToken");
const { getComments } = require("../controllers/commentController");
const { getSingleDocument } = require("../controllers/factoryHandlers");
const multer = require("multer");
const isLoggedin = require("../middleware/isLoggedin");
const storageDisk = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./staticFiles/imgs/`);
  },
  filename: (req, file, cb) => {
    const { mimetype, filename, fieldname, size } = file;
    cb(
      null,
      `${fieldname}-${Math.floor(Math.random() * 1e10)}.${
        mimetype.split("/")[1]
      }`
    );
  },
});

const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
  // limits: { fileSize: 100 },
  fileFilter: (req, file, cb) => {
    const fileEx = file.mimetype.split("/")[1];
    console.log(file);
    if (fileEx === "png" || fileEx === "jpeg") {
      console.log(fileEx);
      cb(null, true);
    } else {
      cb("the file extention Does not matches with requirments!.", false);
    }
  },
});
const router = express.Router();
router.route("/logout").get(logout);
router.route("/login").post(login);

// router.use(isLoggedin);

router.use("/:id/comments", commentRouter);
router.route("/comments").get(getComments);
router.route("/clear").delete(deleteAllUsers);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:token").patch(resetPassword);
router.route("/").get(getAllUsers).post(
  // File Upload ( upload user image )

  // upload.single("photo")
  // (req, res, next) => {
  //   if (!req.files) {
  //     return next("please upload file and try again");
  //   }
  //   next();
  // },
  // (req, res, next) => {
  //   console.log();
  //   res.send(`Uploaded (${req.files.length}) Files Sucessfull.`)
  //   // next();
  // }

  // saveImage
  signin
);
router.route("/update-password").patch(updatePassword);
router.get("/generate-token", (req, res, next) =>
  res.json({ token: generateToken() })
);

// Protected Middlewares

// router.use(validateToken);

router.route("/my-account").get((req, res, next) => {
  req.params.id = req.user;
  next();
}, getSingleDocument(UserModel));
router.delete("/deleteUserData", deleteMyData);
router.route("/:id").delete(deleteUser).get(getSingleUser);
//
router.patch("/update-user-password", updateUserPassword);
router.patch("/block-user/:id", blockUser);
module.exports = router;
