import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// 회원가입 api
app.post("/api/user/signup", (req, res) => {
    const { email, password, nickname, phone, address, school} = req.body;

    if (!email || !password || !nickname || !phone || !address || !school) {
        return res.status(400).json({ message: " 필수 항목 누락"})
    }

    const userId = Date.now().toString();

    res.json({userId});
});

app.post("/api/login", (req, res) => {
    const { email, password, phone, address, school } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "이메일/비번 필요함"})
    }

    res.json({
        user: {
            userId: "1234",
            nickname: "홍길동",
            email,
            phone,
            address,
            school,
        }
    })
})

app.get('/', (req, res) => {
    res.send('Socket.io 채팅 서버가 실행 중입니다.');
});

io.on('connection', (socket) => {
    console.log('사용자 접속:', socket.id);

    socket.on('joinRoom', (roomId) => {3
        socket.join(roomId);
        console.log(`${socket.id}가 ${roomId}에 들어갔습`);
    })

    socket.on('messages', (msg) => {
            const { roomId, sender, content, timestamp } = msg;
            // 특정 채팅방으로만 메시지 전송
            io.to(roomId).emit('messages', {
                roomId,
                sender,
                content,
                timestamp,
            });
    });

    socket.on('disconnect', () => {
        console.log('사용자 연결 해제:', socket.id);
    });
});

const PORT = process.env.PORT || 5174;
server.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
