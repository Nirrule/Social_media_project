const postModel = require("../modeles/post.model");
const userModel = require("../modeles/user.model");
const objectId = require("mongoose").Types.ObjectId;
const { uploadErrors } = require("../utils/error.utils");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

//PARTIE 1 : POST

module.exports.readPost = (req, res) => {
  postModel
    .find((err, docs) => {
      if (!err) res.send(docs);
      else console.log("Error to get data: " + err);
    })
    .sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {
  // let fileName;

  // if (req.file !== null) {
  //   try {
  //     if (
  //       req.file.detectedMimeType != "image/jpg" &&
  //       req.file.detectedMimeType != "image/png" &&
  //       req.file.detectedMimeType != "image/jpeg"
  //     )
  //       throw Error("invalid file");

  //     if (req.file.size > 500000) throw Error("max size");
  //   } catch (err) {
  //     const errors = uploadErrors(err);
  //     return res.status(201).json({ errors });
  //   }
  //   fileName = req.body.posterId + Date.now() + ".jpg";

  //   await pipeline(
  //     req.file.stream,
  //     fs.createWriteStream(
  //       `${__dirname}/../client/public/uploads/posts/${fileName}`
  //     )
  //   );
  // }

  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
    // picture: req.file !== null ? "./uploads/posts/" + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = (req, res) => {
  if (!objectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedMessage = {
    message: req.body.message,
  };

  postModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedMessage },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("update error " + err);
    }
  );
};

module.exports.deletePost = (req, res) => {
  if (!objectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  postModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error: " + err);
  });
};

//fonction servant à liker des posts
module.exports.likePost = async (req, res) => {
  if (!objectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await postModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true }
      )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));

    await userModel
      .findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true }
      )
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//fonction servant à unlike un post
module.exports.unlikePost = async (req, res) => {
  if (!objectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await postModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true }
      )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));

    await userModel
      .findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likes: req.params.id },
        },
        { new: true }
      )
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//PARTIE 2 : COMMENTS

module.exports.commentPost = (req, res) => {
  if (!objectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return postModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(401).send(err);
      }
    );
  } catch (err) {
    return res.status(401).send(err);
  }
};

//fonction servant à modifier les comments
module.exports.editCommentPost = (req, res) => {
  if (!objectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    //les comments étant un sous ensemble de post model, on doit d'abord trouver la table "Comments"
    return postModel.findById(req.params.id, (err, docs) => {
      //ensuite on crée une const qui va aller chercher les comments stocké dans l'array "Comments" dans le post model via leurs id
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );

      //si pas de comment trouvé on renvoi une erreur
      if (!theComment) return res.status(400).send("Comment not found");
      theComment.text = req.body.text;

      //si pas d'erreur on save l'update et on l'envoi
      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  if (!objectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return postModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
