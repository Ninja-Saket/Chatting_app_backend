const socketIo = require("socket.io");
const cors = require("cors");

const users = new Map();

const SocketServer = (server) => {
  const io = socketIo(server, { cors: { origin: "*" } });
  io.on("connect", (socket) => {
    socket.on("join", async (user) => {
      let sockets = [];
      if (users.has(user.id)) {
        const existingUser = users.get(user.id);
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        users.set(user.id, existingUser);
        sockets = [...existingUser.sockets, ...[socket.id]];
      } else {
        users.set(user.id, { id: user.id, sockets: [socket.id] });
        sockets.push(socket.id);
      }

      const onlineFriends = [];

      const chatters = []; //query

      // Notify his friends that user is online
      for (let i = 0; i < chatters.length; i++) {
        if (users.has(chatters[i])) {
          const chatter = users.get(chatters[i]);
          chatter.sockets.forEach((socket) => {
            try {
              io.to(socket).emit("online", user);
            } catch (error) {}
          });
          onlineFriends.push(chatter.id);
        }
      }

      // Send to user sockets which of his friends are online
      sockets.forEach((socket) => {
        try {
          io.to(socket).emit("friends", onlineFriends);
        } catch (error) {}
      });
    });
  });
};

module.exports = SocketServer;
