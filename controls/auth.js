const userSchema = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const maxAge = 60 * 60 * 24;

//Generating Token
const generToken = (data) => {
  return jwt.sign({ data }, "Hawiat erp system", {
    expiresIn: maxAge,
  });
};

const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(415).json({ message: "Invalid email or password" });
    }

    const cookie = generToken({
      userName: user.userName,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      _id: user._id,
    });

    return res.status(200).json({ token: cookie });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ message: "error here" });
  }
};

module.exports = {
  doLogin,
  generToken,
};
