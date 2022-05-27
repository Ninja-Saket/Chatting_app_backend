const models = require("../models");
const User = models.User;
const Chat = models.Chat;
const ChatUser = models.ChatUser;
const Message = models.Message;
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const e = require("express");

exports.index = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
    include: [
      {
        model: Chat,
        include: [
          {
            model: User,
            where: {
              [Op.not]: {
                id: req.user.id,
              },
            },
          },
          {
            model: Message,
            limit: 20,
            order: [["id", "DESC"]],
          },
        ],
      },
    ],
  });
  return res.send(user.Chats);
};

exports.create = async (req, res) => {
  const { partnerId } = req.body;
  const t = await sequelize.transaction();
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: ChatUser,
          where: {
            userId: partnerId,
          },
        },
      ],
    });
    if (user && user.Chats.length > 0)
      return res.status(403).json({
        status: "Error",
        message: "Chat with this user already exist",
      });

    const chat = await Chat.create({ type: "dual" }, { transaction: t });
    await ChatUser.bulkCreate(
      [
        {
          chatId: chat.id,
          userId: req.user.id,
        },
        {
          chatId: chat.id,
          userId: partnerId,
        },
      ],
      { transaction: t }
    );

    await t.commit();

    const newChat = await Chat.findOne({
      where: {
        id: chat.id,
      },
      include: [
        {
          model: User,
          where: {
            [Op.not]: {
              id: req.user.id,
            },
          },
        },
        {
          model: Message,
        },
      ],
    });
    return res.send(newChat);
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ status: "Error", message: e.message });
  }
};
