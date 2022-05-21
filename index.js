const express = require("express");

const app = express();
const port = 3000;

app.get("/home", (req, res) => {
  return res.send("Home Screen Now!");
});

app.get("/login", (req, res) => {
  return res.send("Login Screen Works Now!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
