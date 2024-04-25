const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");

require('dotenv').config();
const url = process.env.CLIENT_URL;

const app = express();
app.use(cors({
    origin: url, // Allow requests from the specified origin
    methods: ["GET", "POST"], // Allow only GET and POST requests
}));

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${server.address().port}`);
});

const io = new Server(server);

let onlineUsers = [];

io.on("connection", (socket) => {
    //console.log("New Connection", socket.id)

    socket.on("addNewUser", (userId) => {
        !onlineUsers.some(user => user.userId === userId) &&
            onlineUsers.push({
                userId,
                socketId: socket.id,
            });
        //console.log("onlineUsers", onlineUsers)
        io.emit("getOnlineUsers", onlineUsers);
    });

    // add message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.receiverId);
        //console.log(message.receiverId)
        if (user) {
            //console.log(user)
            io.to(user.socketId).emit("getMessage", message);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});
