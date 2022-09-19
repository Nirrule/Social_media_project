const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");
const multer = require("multer");

//authentification
router.post("/register", authController.signUp); // méthode post pour envoyer des infos au serveur et à la DB
router.post("/login", authController.signIn);
router.get("/logout", authController.logOut);

//userDB
router.get("/", userController.getAllUsers); // méthode get pour obtenir des infos du serveur et de la DB
router.get("/:id", userController.getUserInfo);
router.put("/:id", userController.updateUser); // méthode put pour créer une nouvelle info ou remplacer une info existante
router.delete("/:id", userController.deleteUser); // méthode delete servant à effacer des données de la DB
router.patch("/follow/:id", userController.follow); //méthode patch permet de modifier partiellement des infos MAIS requière des conditions
router.patch("/unfollow/:id", userController.unfollow);

//upload picture
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../client/public/uploads/profil/`);
  },
  filename: function (req, file, cb) {
    console.log(req.body.name);
    cb(null, req.body.name + ".jpg");
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadController.uploadProfil);

module.exports = router;
