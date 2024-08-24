const express = require('express');
const app = express();
var cors = require('cors')
const http = require('http');
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: '*',
    }
});

const corsOptions = {
    origin: '*',//(https://your-client-app.com)
    // optionsSuccessStatus: 200,
};

app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.json("All working!");
});

let users = [];

io.on('connection', function(socket){
//   console.log('a user connected');

  socket.on('login', function(data){
    // console.log('a user ' + data.name + ' connected');
    socket.user = data.email
    // saving userId to object with socket ID
    if (users.filter(el => el.name == data.name).length == 0 && data.name != null) {
        users.push({name: data.name, status: data.status, avatar: data.avatar, id: data.id, email: data.email});
    }
    io.emit("users", users)
  });

  socket.on('disconnect', function(){
    console.log(`user ${socket.user} is disconnected`);
    // remove saved socket from users object
    // if (socket.user) {
        // users.splice(users.indexOf(socket.user), 1);
        users = users.filter(el => el.email != socket.user)
        io.sockets.emit("users", users);
        console.log("remaining users:", users);
    // }
    // io.emit("users", users)
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});