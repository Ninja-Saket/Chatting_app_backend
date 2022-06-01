require("dotenv").config();

module.exports = {
  appPort: process.env.PORT,
  appKey: process.env.APP_KEY,
  appUrl: process.env.APP_URL,
};
