import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.get('/', (req, res) => {
    res.send('Socket.io 채팅 서버가 실행 중입니다.');
});

io.on('connection', (socket) => {
    console.log('사용자 접속:', socket.id);

    socket.on('messages', (msg) => {
        io.emit('messages', msg);
    });

    socket.on('disconnect', () => {
        console.log('사용자 연결 해제:', socket.id);
    });
});

const PORT = process.env.PORT || 5174;
server.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on('messages', ({ roomId, ...message }) => {
        // 특정 채팅방으로만 메시지 전송
        io.to(roomId).emit('messages', { ...message, roomId });
    });
});