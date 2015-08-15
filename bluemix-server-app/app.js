'use strict';
var
  express = require('express'),
  cfenv = require('cfenv');

var app = express();

var port = (process.env.VCAP_APP_PORT || 3000);

var bot = require('./module/cita_reminderbot');

// var test = require('./module/cita_test');

var appEnv = cfenv.getAppEnv();

var server = app.listen(appEnv.port, appEnv.bind, function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

setInterval(function() {
  global.gc();
  // console.log('GC done')
}, 999999);
