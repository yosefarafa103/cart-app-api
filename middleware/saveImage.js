const sharp = require("sharp");

module.exports = (req, res, next) => {
  // /staticFiles/imgs
  req.file.filename = `staticFiles/imgs/img-${Math.floor(
    Math.random() * 1e10
  )}.png`;
  sharp(req.file.buffer)
    .resize(600, 600, {
      fit: "cover",
    })
    .toFormat("png")
    .png({ quality: 60 })
    .toFile(req.file.filename);
  res.json({
    message: "Uploaded The Image.",
    imgSrc: req.file.filename,
  });
};
