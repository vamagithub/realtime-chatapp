const path = require('path');
const express = require('express');
const http =  require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();

// in order to setup socket io, we need to first setup server. 
const server = http.createServer(app);  
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "ChatCord Bot";


// Run when a client connects
io.on('connection', socket => {
    // console.log('New web socket connection...');

    socket.on('joinRoom', ({ username, room}) => {
    
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName,'Welcome to chatcord!') );
    
    
        // broadcast emit vs emit -> notify every one except user who connected
        socket.broadcast.emit('message', formatMessage(botName,'A user has joined') );

        // to emit to a specific room use this
        socket.broadcast.to(user.room).emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat`)
        );

        // send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        // console.log(msg);

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username, msg) );
    });

    // runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`) );

            // send updated user and room info, after someone has left/disconnected the chat
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });



});

const PORT =  process.env.PORT || 3000 ;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));