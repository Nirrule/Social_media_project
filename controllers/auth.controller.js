const userModel = require("../modeles/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/error.utils");

const TimeDuration = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: TimeDuration,
  });
};

module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body; // req.body prend en compte les infos mis en Input (champs à remplir par ex)

  try {
    const user = await userModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(200).send({ errors });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, TimeDuration });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const error = signInErrors(err);
    res.status(200).send({ error });
  }
};

module.exports.logOut = (req, res) => {
  res.cookie("jwt", "", { TimeDuration: 1 });
  res.redirect("/");
};
