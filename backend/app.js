const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/test';

mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to mongo');
});

const MessageSchema = new mongoose.Schema({
  message: String
});

const Message = mongoose.model('Message', MessageSchema);

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

io.on('connection', (socket) => {
  console.log('connected user');
  Message.find(function (err, messages) {
    if (err) return console.error(err);

    console.log(messages);

    let allMessages = '';

    messages.forEach((item) => {
      allMessages += `${item.message}\n`;
    });

    io.emit('chat message', allMessages);
  });

  socket.on('chat message', (msg) => {
    const message = new Message({ message: msg });

    message.save(function (err, message) {
      if (err) return console.error(err);
      console.log('saved');
    });

    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

http.listen(3001, () => {
  console.log('Listening on port :3001')
});
