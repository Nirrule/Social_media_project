const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_MY_PASS +
      "@cluster0.xbwtysy.mongodb.net/social-media"
  )
  .then(() => console.log("nous sommes connecté à MangoDB"))
  .catch((err) => console.log("connexion échoué", err));
