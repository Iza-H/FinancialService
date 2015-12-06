/**
 * Created by izabela on 29/11/15.
 */
var socket = io.connect('http://localhost:3000');
socket.on('connect', function(data){
    socket.emit('join', 'Hello from client');
});
