const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  console.log('Connection succcess');

  var collection = db.db('test').collection('users');

  collection.insertMany([
    {a : 1},
    {a : 2},
    {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
  });

  db.close();
});

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

  socket.on('chat message', (msg) => {
    db.

    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

http.listen(3001, () => {
  console.log('Listening on port :3001')
});
