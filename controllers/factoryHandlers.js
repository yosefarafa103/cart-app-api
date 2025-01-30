const Comment = require("../models/commentsModel");
exports.deleteItems = (modelName) => {
  return async (req, res, next) => {
    await modelName.deleteMany();
    res.send("All Items Deleted".toLowerCase());
  };
};

exports.createItem = (modelName) => {
  return async (req, res, next) => {
    try {
      const document = await modelName.create(req.body);
      if (modelName === Comment) {
        document.commentBy = req.user;
        await document.save();
      }
      res.status(201).json(document);
    } catch (err) {
      return next(err);
    }
  };
};
exports.getItem = (modelName) => {
  return async (req, res, next) => {
    const document = await modelName.findById(req.params.id);
    if (!document) return next("can not find document");
    res.status(200).json(document);
  };
};
exports.getDocuments =
  (modelName, population = "") =>
  async (req, res, next) => {
    const { _id } = req.filter;
    let documents = await modelName.find().populate(population);
    if (Object.keys(req.filter).length > 0) {
      documents = await modelName.find({ commentBy: _id });
    }
    if (!documents.length) {
      return next("no documents yet..!");
    }
    res.status(200).json({
      documentsLength: documents.length,
      documents,
    });
  };
exports.deleteDocuments = (modelName) => async (req, res, next) => {
  await modelName.deleteMany();
  res.send("All Documents Deleted".toLowerCase());
};

exports.updateDocument = (modelName) => async (req, res, next) => {
  const updatedDocument = await modelName.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "updated!",
    updatedDocument,
  });
};
exports.getSingleDocument =
  (modelName, populateOptions, selectOptions) => async (req, res, next) => {
    let document = await modelName
      .findById(req.params.id)
      .select(selectOptions)
      .explain();
    if (populateOptions) {
      document = await document.populate(populateOptions);
    }
    res.status(200).json(document);
  };
exports.checkIfUserInParams = (req, res, next) => {
  let filterComments = {};
  if (req.params.id) {
    filterComments = { _id: req.params.id };
  }
  req.filter = filterComments;
  next();
};
exports.deleteDocument = (modelName) => async (req, res, next) => {
  await modelName.findByIdAndDelete(req.params.id);
  res.send("deleted!");
};
