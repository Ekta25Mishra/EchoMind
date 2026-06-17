const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();



// CORS
app.use(cors({
  origin: [
    "https://echo-mind-one.vercel.app",
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ],
  credentials: true
}));


// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({
 extended:true
}));

// API
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


// test
app.get("/api", (req,res)=>{
  res.json({
    message:"EchoMind API running"
  });
});




module.exports = app;