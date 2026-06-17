const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();


/* const publicPath = path.join(__dirname, "../public");
 */

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));


// middlewares
app.use(express.json());
app.use(cookieParser());


// API
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


// test
app.get("/api", (req,res)=>{
  res.json({
    message:"EchoMind API running"
  });
});
/* 

// IMPORTANT: serve assets first
app.use(
  "/assets",
  express.static(path.join(publicPath, "assets"))
);


// serve all frontend files
app.use(
  express.static(publicPath)
);


// fallback only for frontend routes
app.get("/{*splat}", (req,res,next)=>{

  // do not hijack api calls
  if(req.path.startsWith("/api")){
    return next();
  }

  res.sendFile(
    path.join(publicPath,"index.html")
  );
});
 */

module.exports = app;