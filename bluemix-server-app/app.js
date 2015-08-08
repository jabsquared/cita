/**
 * Module dependencies.
 */

var
  express = require('express'),
  cfenv = require('cfenv');

var app = express();

var port = (process.env.VCAP_APP_PORT || 3000);

var dev = true;

// aptDB.destroy().then(function (response) {
//   // success
// }).catch(function (err) {
//   console.log(err);
// });


// var tDate = new Date();
//
// tDate.setTime(tDate.getTime() + 18000);
//
// var barbers = ['Gabino', 'Matt', 'Antonio']
//
// var barber = barbers[Math.floor(Math.random() * barbers.length)];
//
// aptDB.put({
//   _id: tDate.toISOString() + '-' + barber,
//   client_name: "Trix",
//   client_phone: "0123456789",
//   barber: barber,
//   time: tDate,
//   alarm: true,
//   sms_0: false,
//   sms_1: false,
//   done: false,
// }).then(function(response) {
//   // Show some pops up fancy stuffs here, also go back to login.
//   // console.log(response);
// }).catch(function(err) {
//   console.log(err);
// });

var cita_pouchdb = require('./module/cita_pouchdb');

var cita_reminderbot = require('./module/cita_reminderbot');

var cita_twilio = require('./module/cita_twilio');



var appEnv = cfenv.getAppEnv();

var server = app.listen(appEnv.port, appEnv.bind, function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

setInterval(function() {
  global.gc();
  // console.log('GC done')
}, 1000 * 30);
