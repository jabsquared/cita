'use strict';

var restify = require('restify');

var server = restify.createServer();

var bot = require('./module/cita_reminderbot');

// var test = require('./module/cita_test');

server.listen(process.env.VCAP_APP_PORT || 3000, function() {
	console.log('Travel service listening on '+ server.url);
});

setInterval(function() {
  global.gc();
  // console.log('GC done')
}, 999999);
