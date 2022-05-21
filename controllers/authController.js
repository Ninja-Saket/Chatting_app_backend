const User = require("../models").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
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
    return res.send(userWithToken);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  return res.send([email, password]);
};

exports.register = async (req, res) => {};

const generateToken = (user) => {
  delete user.password;
  const token = jwt.sign(user, "secret", { expiresIn: 86400 });
  return { ...user, ...{ token } };
};
