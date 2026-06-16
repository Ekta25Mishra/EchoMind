const chatModel = require("../models/chat.model")
const messageModel = require("../models/message.model")

async function getUserChats(req, res) {
  const chats = await chatModel.find({ user: req.user._id }).sort({ lastActivity: -1 }).lean()
  res.json({ chats: chats.map(c => ({ id: c._id, title: c.title, pinned: false, lastActivity: c.lastActivity })) })
}

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

async function deleteChat(req, res) {
  const { id } = req.params
  await Promise.all([
    chatModel.findOneAndDelete({ _id: id, user: req.user._id }),
    messageModel.deleteMany({ chat: id })
  ])
  res.json({ message: 'Chat deleted' })
}

async function updateChatTitle(req, res) {
  const { id } = req.params
  const { title } = req.body
  if (!title?.trim()) return res.status(400).json({ message: 'Title required' })
  const chat = await chatModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { title: title.trim() },
    { new: true }
  )
  if (!chat) return res.status(404).json({ message: 'Chat not found' })
  res.json({ chat: { id: chat._id, title: chat.title } })
}

async function deleteMessage(req, res) {
  const { chatId, msgId } = req.params
  await messageModel.findOneAndDelete({ _id: msgId, chat: chatId })
  res.json({ message: 'Message deleted' })
}

module.exports = { getUserChats, createChat, getChatMessages, deleteChat, updateChatTitle, deleteMessage, formatMessage }