var zmq = require('zmq'),
    sock = zmq.socket('sub');

sock.connect('tcp://127.0.0.1:3000');
sock.subscribe('bernini');
console.log('Subscriber connected to tcp://127.0.0.1:3000');

sock.on('message', function(topic, message) {
  console.log('received a message related to:', topic.toString('utf8'), 'containing message:', message.toString('utf8'));
});
