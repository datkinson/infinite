var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var forward = require('./routes/forward');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
  res.io = io;
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/forward', forward);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var clients = [];
var player = {
  position: 0,
  maxPosition: 0
};
var timer;

function movePlayer(amount) {
  // console.log('player: ', player);
  // console.log('player position: ', player.position);
  // console.log('moving: ', amount);
  player.position += amount;
  // console.log('new position: ', player.position);
  // console.log('--------------------------');
  if (player.position > player.maxPosition) {
    player.position = -50;
  }
  io.sockets.emit('playerMove', player.position);
};

io.on('connection', function (socket) {
  console.log(socket.id);
  clients[socket.id] = {socket: socket};

  socket.on('disconnect', function() {
    console.log('disconnected: ', socket.id);
    delete clients[socket.id];
  });

  io.sockets.emit('ping', 'ping');
  socket.on('clientInformation', function(information) {
    clients[socket.id].information = information;
    var totalWidth = 0;
    for (var key in clients) {
      if ('information' in clients[key]) {
        clients[key].offset = totalWidth;
        clients[key].socket.emit('offsetUpdate', clients[key].offset);
        totalWidth += clients[key].information.width;
      }
    }
    player.maxPosition = totalWidth;
    io.sockets.emit('playerUpdate', player);
  });
  socket.on('movePlayer', function (difference) {
    movePlayer(difference);
  });

  socket.on('playerRun', function(command) {
    timer = setInterval(function() {
      // console.log('step');
      movePlayer(10);
    }, 100);
  });

  socket.on('playerStop', function(command) {
    console.log('stand');
    clearInterval(timer);
  });

  socket.emit('requestClientInformation', true);
});


module.exports = {app: app, server: server};
