const express = require("express");
const config = require("./config/app");
const router = require("./router");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http");
const path = require("path");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

process.env.PWD = process.cwd();
app.use(express.static(path.join(process.env.PWD, "public")));
app.use(express.static(path.join(process.env.PWD, "uploads")));

// app.use(express.static(__dirname + "/public"));
// app.use(express.static(__dirname + "/uploads"));

const port = config.appPort;
const server = http.createServer(app);
const SocketServer = require("./socket");
SocketServer(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
