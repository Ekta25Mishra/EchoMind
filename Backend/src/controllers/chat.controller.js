const chatModel = require("../models/chat.model")
const messageModel = require("../models/message.model")

async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;

  const chat = await chatModel.create({ user: user._id, title });

  res.status(201).json({
    message: "Chat created successfully",
    chat: { _id: chat._id, title: chat.title, lastActivity: chat.lastActivity, user: chat.user }
  })
}

async function getChatMessages(req, res) {
  const messages = await messageModel.find({ chat: req.params.id }).sort({ createdAt: 1 }).lean()
  res.json({ messages: messages.map(formatMessage) })
}

function formatMessage(msg) {
  return {
    id: msg._id,
    role: msg.role === 'model' ? 'ai' : msg.role,
    text: msg.content,
    timestamp: msg.createdAt
  }
}

module.exports = { createChat, getChatMessages, formatMessage }