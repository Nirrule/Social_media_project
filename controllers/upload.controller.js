const UserModel = require("../modeles/user.model");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/error.utils");

module.exports.uploadProfil = async (req, res) => {
  console.log(req.body.name);
  try {
    if (
      req.file.mimetype != "image/jpg" &&
      req.file.mimetype != "image/png" &&
      req.file.mimetype != "image/jpeg"
    )
      throw Error("invalid file");

    if (req.file.size > 5000000) throw Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }

  try {
    userModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {
          picture: "./uploads/profil/" + req.body.name + ".jpg",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: "err" });
  }
};
