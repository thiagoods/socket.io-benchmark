var profile = require('v8-profiler');
var io = require('socket.io-client');

var message = "o bispo de constantinopla nao quer se desconstantinopolizar";

function user(shouldBroadcast, host, port) {
  var socket = io.connect('http://' + host + ':' + port, {'forceNew': true, transports: ['websocket']});

  socket.on('connect', function() {
    if (shouldBroadcast) {
      socket.emit('broadcast', message);
    } else {
      socket.send(message);
    }

    socket.on('message', function(message) {
      socket.send(message);
    });

    socket.on('broadcastOk', function() {
      socket.emit('broadcast', message);
    });

    socket.once('disconnect', function() {
      socket.connect();
    });
  });
};

var argvIndex = 2;

var users = parseInt(process.argv[argvIndex++]);
var rampUpTime = parseInt(process.argv[argvIndex++]) * 1000;
var newUserTimeout = rampUpTime / users;
var shouldBroadcast = process.argv[argvIndex++] === 'broadcast' ? true : false;
var host = process.argv[argvIndex++] ? process.argv[argvIndex - 1]  : 'localhost';
var port = process.argv[argvIndex++] ? process.argv[argvIndex - 1]  : '3000';

for(var i=0; i<users; i++) {
  setTimeout(function() { user(shouldBroadcast, host, port); }, i * newUserTimeout);
};
