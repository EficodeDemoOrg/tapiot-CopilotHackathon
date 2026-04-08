const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3004;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Track online users and message history
const onlineUsers = new Map(); // socketId -> { nickname, avatar }
const messageHistory = [];
const MAX_HISTORY = 200;

io.on('connection', (socket) => {
    console.log(`Connection: ${socket.id}`);

    // User joins with a nickname
    socket.on('user join', (userData) => {
        onlineUsers.set(socket.id, {
            nickname: userData.nickname,
            avatar: userData.avatar
        });

        // Send message history to the new user
        socket.emit('message history', messageHistory);

        // Broadcast updated user list
        io.emit('user list', Array.from(onlineUsers.values()));

        // Announce join
        const joinMsg = {
            type: 'system',
            text: `${userData.nickname} joined the chat`,
            timestamp: Date.now()
        };
        messageHistory.push(joinMsg);
        if (messageHistory.length > MAX_HISTORY) messageHistory.shift();
        io.emit('chat message', joinMsg);
    });

    // Chat message
    socket.on('chat message', (msg) => {
        const user = onlineUsers.get(socket.id);
        if (!user) return;

        const message = {
            type: 'text',
            nickname: user.nickname,
            avatar: user.avatar,
            text: msg.text,
            timestamp: Date.now()
        };
        messageHistory.push(message);
        if (messageHistory.length > MAX_HISTORY) messageHistory.shift();
        io.emit('chat message', message);
    });

    // Image message
    socket.on('image message', (msg) => {
        const user = onlineUsers.get(socket.id);
        if (!user) return;

        // Validate URL format
        try {
            const url = new URL(msg.imageUrl);
            if (!['http:', 'https:'].includes(url.protocol)) return;
        } catch {
            return;
        }

        const message = {
            type: 'image',
            nickname: user.nickname,
            avatar: user.avatar,
            imageUrl: msg.imageUrl,
            timestamp: Date.now()
        };
        messageHistory.push(message);
        if (messageHistory.length > MAX_HISTORY) messageHistory.shift();
        io.emit('chat message', message);
    });

    // Disconnect
    socket.on('disconnect', () => {
        const user = onlineUsers.get(socket.id);
        if (user) {
            const leaveMsg = {
                type: 'system',
                text: `${user.nickname} left the chat`,
                timestamp: Date.now()
            };
            messageHistory.push(leaveMsg);
            if (messageHistory.length > MAX_HISTORY) messageHistory.shift();
            onlineUsers.delete(socket.id);
            io.emit('user list', Array.from(onlineUsers.values()));
            io.emit('chat message', leaveMsg);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Chat server running at http://localhost:${PORT}`);
});
