/**
 * Module dependencies.
 */

var
  express = require('express'),
  https = require('https'),
  path = require('path'),
  fs = require('fs'),
  cfenv = require('cfenv'),
  PouchDB = require('pouchdb');

var app = express();

var port = (process.env.VCAP_APP_PORT || 3000);

var vcapServices = JSON.parse(process.env.VCAP_SERVICES || "{}");

var aptDB = new PouchDB('https://patestediescruslyindowne:t8txxKMPF3MBDRWqmCndXc5d @af48ada6-78db-4210-a80d-86619c82407e-bluemix.cloudant.com/appointments/', {
  auth: {
    username: 'patestediescruslyindowne',
    password: 't8txxKMPF3MBDRWqmCndXc5d'
  }
});

app.get('/twilio', function(req, res) {

  // https://cita-beau-barbershop.mybluemix.net/twilio

  aptDB.allDocs({
    include_docs: true,
    attachments: true
  }, function(err, response) {
    if (err) {
      return console.log(err);
    }
    // handle result
    res.send(response);
  });
});

var changes = aptDB.changes({
  since: 'now',
  live: true,
  include_docs: true
}).on('change', function(change) {
  // handle changeq

  if (change == null)
    return

  var apt = change.doc;

  var msg = "From The Beau Brother: You scheduled a hair cut at " + apt.time + " with " + apt.barber + ". Have a nice day, " + apt.client_name + "!";

  // sendsms(0, "+12067909711", msg);
  // sendsms(1, null, msg);

  // console.log(msg);
  console.log(change);

}).on('complete', function(info) {
  // changes() was canceled
}).on('error', function(err) {
  console.log(err);
});

// Put a design doc into the db

var smsLoop = function() {

  setTimeout(function() {

    // Filtered by Date with a view

    // If Date.now is 6AM: && 1st reminder == false

    console.log(Date.now());
    // Send Reminder SMS

    // If Date.now is 30 minutes away && 2nd reminder == false

    // Send Reminder SMS

    // If Date.now is the time, Mark the status as Done

    smsLoop(); //Call itself
  }, 3000);
}
smsLoop();



// 1800000 for 30 minutes

//TODO: After established the server with stuffs, we will have this twilio module up and running.

/*

var cred = vcapServices.cloudantNoSQLDB[0].credentials;

dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;

*/


// var twilio = require('twilio');
//
// var twilioSid, twilioToken;
// vcapServices['user-provided'].forEach(function(service) {
//   // if (service.name == 'Twilio-9n') { // Release Twilio
//   if (service.name == 'Twilio-79') {  // Test Twilio
//     twilioSid = service.credentials.accountSID;
//     twilioToken = service.credentials.authToken;
//   }
// });
//
// var sendsms = function(id, toNum, msg) {
//   // var fromNum = '+13602343448';  // Bryan's #
//   var fromNum = '+14696152255'; // LAB's free #
//
//   if (toNum == null)
//     // toNum = "+12067909711"; // Bogdan's #
//     toNum = "+12536422707"; // LAB's #
//
//   if (msg == null)
//     msg = "FROM BLUEMIX";
//
//   var client = new twilio.RestClient(twilioSid, twilioToken);
//
//   client.sendMessage({
//     to: toNum,
//     from: fromNum,
//     body: msg
//   }, function(err, message) {
//     if (err) {
//       console.error("Problem: " + message);
//       console.log("Error: " + message);
//       return;
//     } else {
//       console.log("Done");
//     }
//   });
// }

// https.createServer(app).listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
// });

var appEnv = cfenv.getAppEnv();

var server = app.listen(appEnv.port, appEnv.bind, function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
