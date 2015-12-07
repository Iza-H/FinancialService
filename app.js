var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//var jwt = requiere('jsonwebtoken');

var app = express();

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'));
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  console.log('Socket connected!');

});

app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index'));



//Connect to the DB:
require('./lib/db');

//Set schedule
require('./models/Users.js');
require('./lib/schedule');

require('./models/Stock.js')(io);
app.use('/apiv1/stock', require('./routes/apiv1/stock'));


app.use('/apiv1/users', require('./routes/apiv1/user'));





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Site not Found');
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





module.exports = app;
