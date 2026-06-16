const express= require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

/* Routes */
const authRoutes = require("./routes/auth.routes");
const chatRoutes=require("./routes/chat.routes")

const app=express();

/*using middlewares*/
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // allow server-to-server / curl requests (no origin header)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "../public")))


app.get("/", (req, res) => {
  res.status(200).json({
    message: "EchoMind Backend is running 🚀"
  });
});

/*using routes*/
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes)

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

module.exports=app;