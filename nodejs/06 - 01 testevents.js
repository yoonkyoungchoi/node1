const EventEmitter = require('events');

let emitter = new EventEmitter();
emitter.addListener('event1', print);
emitter.on('event1', print);
emitter.once('event1', print);

emitter.emit('event1', 'msg-1');
emitter.emit('event1', 'msg-2');
emitter.emit('event1', EventEmitter);

function print(msg){
    console.log(msg);
}

