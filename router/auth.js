const router = require("express").Router();

router.get("/login", (req, res) => {
  return res.send("Login Screen");
});

router.get("/register", (req, res) => {
  return res.send("Register Screen");
});

module.exports = router;
