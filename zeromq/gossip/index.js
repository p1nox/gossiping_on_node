const R = require('ramda'),
  zmq = require('zmq'),
  pub = zmq.socket('pub'),
  sub = zmq.socket('sub');

const GOSSIPER_ROLE = 'gossiper',
      argv = require('minimist')(process.argv.slice(2)),
      configFile = argv.c || argv.configFile,
      config = require('./' + configFile);
console.log(config);

let messagesReceived = R.clone(config.messages);
let channels = R.map(function(channel) {
  channel.pub = pub.bindSync(channel.address_send);
  channel.sub = sub.connect(channel.address_receive);

  // subscribe
  channel.sub.subscribe(channel.tag_receive)
  .on('message', function(topic, message) {
    if (messagesReceived[message]) {
      return ;
    }

    messagesReceived[message] = 1;
    console.log('received a "', topic.toString('utf8'), '" saying: ', message.toString('utf8'));
    startGossiping(message);
  });

  return channel;
})(config.channels);

if (config.role === GOSSIPER_ROLE) {
  startGossiping();
}

setInterval(function(){
  console.log('messages: ', R.keys(messagesReceived));
}, 1000);

function startGossiping(msg) {
  setInterval(function(){
    const randomChannelInt = getRandomInt(0, config.channels.length);

    let channel = config.channels[randomChannelInt],
        message = msg || R.keys(config.messages)[0];
    if (!message) {
      return ;
    }

    console.log('gossiping "' + message + '" to ' + channel.address_send);
    channel.pub.send([channel.tag_send, message]);
  }, 5000);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
