var zmq = require('zmq'),
    sock = zmq.socket('push');

sock.bindSync('tcp://127.0.0.1:3000');
console.log('Producer bound to port tcp://127.0.0.1:3000');

var i = 0;

setInterval(function(){
  var msg = 'da work ' + i++;
  console.log('sending: ', msg);
  sock.send(msg);
}, 1000);
