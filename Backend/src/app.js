const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

/* Routes */
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();


const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);


app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return cb(null, true);
    }

    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


// API routes first
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


// Backend health route
app.get("/api", (req, res) => {
  res.json({
    message: "EchoMind Backend is running 🚀"
  });
});


// Serve React build ONLY if it exists
const frontendPath = path.join(__dirname, "../../frontend/dist");

app.use(express.static(frontendPath));


// React fallback
app.get("*", (req, res) => {
  res.sendFile(
    path.join(frontendPath, "index.html")
  );
});


module.exports = app;