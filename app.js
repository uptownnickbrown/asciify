var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

var asciify = require('./routes/asciify');
app.use('/asciify', asciify);

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
    res.status('error').send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.status('error').send({
    message: err.message,
    error: {}
  });
});


module.exports = app;