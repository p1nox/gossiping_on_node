var zmq = require('zmq'),
    sock = zmq.socket('pub');

sock.bindSync('tcp://127.0.0.1:3000');
console.log('Publisher bound to tcp://127.0.0.1:3000');

setInterval(function(){
  console.log('sending a multipart message envelope');
  sock.send(['bernini', 'ciao!']);
}, 1000);
