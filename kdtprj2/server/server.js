import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 회원가입 API (항상 user1로 응답)
app.post("/api/user/signup", (req, res) => {
  // 필수 항목 체크는 생략 또는 필요시 사용
  res.json({ userId: "user1" });
});

// 로그인 API (항상 user1로 응답)
app.post("/api/login", (req, res) => {
  // 이메일/비번 체크는 필요시 사용
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "이메일/비번 필요함" });
  }

  res.json({
    user: {
      userId: "user1",
      nickname: "user1",
      email: "user1@example.com",
      phone: "010-0000-0000",
      address: "서울시 임시주소",
      school: "삼육대학교",
    },
  });
});

// 서버 상태 확인용
app.get("/", (req, res) => {
  res.send("Socket.io 채팅 서버가 실행 중입니다.");
});

// 소켓 이벤트
io.on("connection", (socket) => {
  console.log("사용자 접속:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id}가 ${roomId}에 들어갔습니다`);
  });

  socket.on("sendMessage", (msg) => {
    const { roomId, sender, content, timestamp } = msg;
    // 해당 채팅방(roomId)에만 메시지 전송
    io.to(roomId).emit("messages", {
      roomId,
      sender,
      content,
      timestamp,
    });
    console.log(`[${roomId}] ${sender}: ${content}`);
  });

  socket.on("disconnect", () => {
    console.log("사용자 연결 해제:", socket.id);
  });
});

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
