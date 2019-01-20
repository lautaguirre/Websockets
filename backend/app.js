var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

io.on('connection', function(socket) {
  console.log('connected user');

  socket.on('disconnect', function() {
    console.log('disconnected');
  });
});

http.listen(3001, function() {
  console.log('Listening on port :3001')
});
