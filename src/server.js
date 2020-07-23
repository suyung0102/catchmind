import { join } from "path";
import express from "express";
import socketIO from "socket.io";
import logger from "morgan";

const PORT = 3000;
const app = express();
// view engine는 view의 확장자 = pug로 설정
app.set("view engine", "pug");
// views는 view의 폴더명 = 현재디렉토리/views/파일이름
app.set("views", join(__dirname, "views"));
app.use(logger("dev"));
// 현재디렉토리/static/~~.js ~~.css등
app.use(express.static(join(__dirname, "static")));
app.get("/", (req, res) => res.render("home"));

const handleListening = () =>
  console.log(`✅ Server running: http://localhost:${PORT}`);

const server = app.listen(PORT, handleListening);

const io = socketIO.listen(server);

io.on("connection", (socket) => {
  socket.on("newMessage", ({ message }) => {
    socket.broadcast.emit("messageNotif", {
      message,
      nickname: socket.nickname || "Anon",
    });
  });
  socket.on("setNickname", ({ nickname }) => {
    socket.nickname = nickname;
  });
});
