const UserModel = require("../modeles/user.model");
const objectId = require("mongoose").Types.ObjectId;

//fonction pour avoir toutes les informations de tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password"); //on met -password dans select pour ne pas importer le password depuis le serveur
  res.status(200).json(users);
};

//fonction permettant d'avoir les infos d'un user en fonction de l'ID
module.exports.getUserInfo = async (req, res) => {
  console.log(req.params); // req.params prendre les infos écrit dans l'URL
  if (!objectId.isValid(req.params.id))
    // le ! définie la négation de la fonction (if (!objectId.isValid(req.params.id)
    // cela veut dire que objectId par eq.params.id est non valide
    return res.status(400).send("Id unknown " + req.params.id);

  UserModel.findById(req.params.id, (err, data) => {
    if (!err) res.send(data);
    else console.log("Id unkown " + err);
  }).select("-password");
};

//fonction permettant d'update des infos d'un user

// 1) on check si l'ID existe sinon fin fonction
module.exports.updateUser = async (req, res) => {
  if (!objectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const docs = await new Promise((resolve, reject) => {
      // ici on doit utiliser un promesse afin de ne pas envoyer 2 requetes en même temps du à "await"
      UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            bio: req.body.bio,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
          if (err) {
            reject(err);
          } else {
            console.log(docs);
            resolve(docs); // et donc ici on utilise resolve avec la const afin de valider l'update si cela fonctionne
          }
        }
      );
    });

    return res.send(docs); // et ici on envoi la reponse au serveur
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//fonction servant à supprimer des users
module.exports.deleteUser = async (req, res) => {
  if (!objectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//fonction permettant de follow
module.exports.follow = async (req, res) => {
  if (
    !objectId.isValid(req.params.id) ||
    !objectId.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    // patrie ajoutant l'id de la personne que l'on veut suivre
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
    // partie ajoutant notre id a la personne qu'on suit
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
    ).catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// fonction permettant d'unfollow
module.exports.unfollow = async (req, res) => {
  if (
    !objectId.isValid(req.params.id) ||
    !objectId.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // patrie ajoutant l'id de la personne que l'on veut suivre
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
    // partie ajoutant notre id a la personne qu'on suit
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
    ).catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
