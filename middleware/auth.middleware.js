const jwt = require("jsonwebtoken");
const userModel = require("../modeles/user.model");

//fonction servant à tester si le user est connecté
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    // étape 1: on vérifie si le user a un token
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      // traitement de la vérification en async
      if (err) {
        // si erreur, on lui enlève le token
        res.locals.user = null;
        res.cookie("jwt", "", { TimeDuration: 1 });
        next();
      } else {
        // sinon on le décrypte
        let user = await userModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    // si il y a pas de token, on renvoi rien.
    res.locals.user = null;
    next();
  }
};

//fonction servant à tester l'authentification du user
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    console.log("Pas de Token");
  }
};
