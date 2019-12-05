const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const fs = require('fs');

const app = express();

app.set('port', '3000');
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'), () => {
    console.log(`Server at port ${app.get('port')}`);
});

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New Connection', socket.id);

    socket.on('chat:message', function (data) {
        io.sockets.emit('chat:return', data)
    })

    socket.on('chat:typing', (user) => {
        /*let readStream = fs.createReadStream(path.resolve(__dirname, 'public/img/escribiendo.gif'), {
            encoding: 'binary'
        }), chunks = [];*/

        /*readStream.on('data', (chunk) => {
            chunks.push(chunk);

            
        })*/
        socket.broadcast.emit('chat:typing-return', user);
    })
})