const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      require: true,
      minlength: 3,
      maxlength: 60,
      unique: true,
      trimp: true,
    },

    email: {
      type: String,
      require: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trimp: true,
    },

    password: {
      type: String,
      require: true,
      max: 1000,
      minlength: 6,
    },
    picture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      max: 500,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//fonction servant à crypter les mdp, a effectuer avant la save dans la DB

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//fonction décrytant le mdp pour se login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
