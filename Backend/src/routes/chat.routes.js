const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const chatController = require("../controllers/chat.controller")

const router = express.Router()

router.get("/", authMiddleware.authUser, chatController.getUserChats)
router.post("/", authMiddleware.authUser, chatController.createChat)
router.delete("/:id", authMiddleware.authUser, chatController.deleteChat)
router.patch("/:id", authMiddleware.authUser, chatController.updateChatTitle)
router.get("/:id/messages", authMiddleware.authUser, chatController.getChatMessages)
router.delete("/:chatId/message/:msgId", authMiddleware.authUser, chatController.deleteMessage)

module.exports = router;