'use strict';

var restify = require('restify');
var server = restify.createServer();

var bot = require('./module/cita_reminderbot');
bot.CheckChanges();

var test = require('./module/cita_test');
test.tia();

var InfiniteLoop = require('infinite-loop');

// Set Timer:
var botil = new InfiniteLoop();
botil.add(bot.SMS, 3000, 4000).setInterval(999).run();
// botil.add(bot.SMS, [30 * 60 * 999, 27*54*999]).setInterval(4500).run();

// Set Garbage collector
var gctil = new InfiniteLoop();
gctil.add(global.gc,[]).setInterval(999999).run();

server.listen(process.env.VCAP_APP_PORT || 3000, function() {
	console.log('Cita service listening on '+ server.url);
});
