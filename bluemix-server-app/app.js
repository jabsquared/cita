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

var localAptDB = new PouchDB('appointments', {
  localAptDB : require('memdown')
});
var remoteAptDB = new PouchDB('https://patestediescruslyindowne:t8txxKMPF3MBDRWqmCndXc5d @af48ada6-78db-4210-a80d-86619c82407e-bluemix.cloudant.com/appointments/', {
  auth: {
    username: 'patestediescruslyindowne',
    password: 't8txxKMPF3MBDRWqmCndXc5d'
  }
});

app.get('/twilio', function(req, res) {

  // https://cita-beau-barbershop.mybluemix.net/twilio

  remoteAptDB.allDocs({
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

var sync = PouchDB.sync(localAptDB, remoteAptDB, {
  live: true,
  retry: true
}).on('change', function(info) {
  // handle change
  console.log(info);
}).on('paused', function() {
  // replication paused (e.g. user went offline)
}).on('active', function() {
  // replicate resumed (e.g. user went back online)
}).on('denied', function(info) {
  // a document failed to replicate, e.g. due to permissions
}).on('complete', function(info) {
  // handle complete
}).on('error', function(err) {
  // handle error
});





//TODO: After established the server with stuffs, we will have this twilio module up and running.
/*

var cred = vcapServices.cloudantNoSQLDB[0].credentials;

dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;

var twilio = require('twilio');

var twilioSid, twilioToken;
vcapServices['user-provided'].forEach(function(service) {
  // if (service.name == 'Twilio-9n') { // Release Twilio
  if (service.name == 'Twilio-79') {  // Test Twilio
    twilioSid = service.credentials.accountSID;
    twilioToken = service.credentials.authToken;
  }
});

var sendsms = function(id, toNum) {
  // var fromNum = '+13602343448';  // Bryan's #
  var fromNum = '+14696152255'; // LAB's free #

  if (toNum == null)
    // toNum = "+12067909711"; // Bogdan's #
    toNum = "+12536422707"; // LAB's #


  var twilioMessage = "FROM BLUEMIX";

  var client = new twilio.RestClient(twilioSid, twilioToken);

  client.sendMessage({
    to: toNum,
    from: fromNum,
    body: twilioMessage
  }, function(err, message) {
    if (err) {
      console.error("Problem: " + message);
      console.log("Error: " + message);
      return;
    } else {
      console.log("Done");
    }
  });
}

sendsms(0, "+12067909711");
sendsms(1, null);

*/

// https.createServer(app).listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
// });

var appEnv = cfenv.getAppEnv();

var server = app.listen(appEnv.port, appEnv.bind, function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
