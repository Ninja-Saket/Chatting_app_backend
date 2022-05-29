const socketIo = require("socket.io");
const cors = require("cors");
const { sequelize } = require("../models");

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

      const chatters = await getChatters(user.id); //query
      console.log(chatters);

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

const getChatters = async (userId) => {
  try {
    const [results, metadata] = await sequelize.query(`
        select "cu"."userId" from "ChatUsers" as "cu"
        inner join(
          select "c"."id" from "Chats" as c
          where exists(
            select "u"."id" from "Users" as u
            inner join "ChatUsers" on u.id = "ChatUsers"."userId"
            where u.id = ${parseInt(userId)} and c.id = "ChatUsers"."chatId"
          )
        ) as cjoin on cjoin.id = "cu"."chatId"
        where "cu"."userId" != ${parseInt(userId)}
      `);
    return results.length > 0 ? results.map((el) => el.userId) : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports = SocketServer;
