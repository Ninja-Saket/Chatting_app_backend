const User = require("../models").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/app");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const secret = require("crypto").randomBytes(64).toString("hex");
    // Find the user
    const user = await User.findOne({
      where: {
        email,
      },
    });
    // User not found
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    // Password donot match
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Incorrect password!" });
    }
    // Generate Json web token for the user
    const userWithToken = generateToken(user.get({ raw: true }));
    userWithToken.avatar = user.avatar;
    return res.send(userWithToken);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  return res.send([email, password]);
};

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userWithToken = generateToken(user.get({ raw: true }));
    return res.send(userWithToken);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const generateToken = (user) => {
  delete user.password;
  const token = jwt.sign(user, config.appKey, { expiresIn: 86400 });
  return { ...user, ...{ token } };
};
