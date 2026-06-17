const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");

const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const ALLOWED_ORIGINS = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "https://echo-mind-one.vercel.app",
  ].filter(Boolean);

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        console.log("Socket origin:", origin);

        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked: ${origin}`));
      },

      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");

      if (!cookies.token) {
        return next(new Error("No authentication cookie"));
      }

      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;

      next();
    } catch (err) {
      console.log(err);

      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.user.email);

    socket.on("ai-message", async (messagePayload) => {
      try {
        if (typeof messagePayload === "string") {
          messagePayload = JSON.parse(messagePayload);
        }

        const [message, vectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,

            user: socket.user._id,

            content: messagePayload.content,

            role: "user",
          }),

          aiService.generateVector(messagePayload.content),
        ]);

        await createMemory({
          vectors,

          messageId: message._id,

          metadata: {
            chat: messagePayload.chat,

            user: socket.user._id,

            text: messagePayload.content,
          },
        });

        const [memory, chatHistory] = await Promise.all([
          queryMemory({
            queryVector: vectors,

            limit: 3,

            metadata: {
              user: socket.user._id,
            },
          }),

          messageModel
            .find({
              chat: messagePayload.chat,
            })
            .sort({
              createdAt: -1,
            })
            .limit(20)
            .lean(),
        ]);

        const stm = (chatHistory || []).reverse().map((item) => ({
          role: item.role,

          parts: [
            {
              text: item.content,
            },
          ],
        }));

        const ltm = [
          {
            role: "user",

            parts: [
              {
                text: `Previous messages:
${(memory || []).map((i) => i.metadata?.text || "").join("\n")}`,
              },
            ],
          },
        ];

        const response = await aiService.generateResponse([...ltm, ...stm]);

        socket.emit("ai-response", {
          content: response,

          chat: messagePayload.chat,
        });

        const [responseMessage, responseVector] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,

            user: socket.user._id,

            content: response,

            role: "model",
          }),

          aiService.generateVector(response),
        ]);

        await createMemory({
          vectors: responseVector,

          messageId: responseMessage._id,

          metadata: {
            chat: messagePayload.chat,

            user: socket.user._id,

            text: response,
          },
        });
      } catch (err) {
        console.log("Socket error:", err);
      }
    });
  });
}

module.exports = initSocketServer;
