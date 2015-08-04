/*jshint node:true*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var twilio = require('twilio');

var port = (process.env.VCAP_APP_PORT || 3000);

var services = JSON.parse(process.env.VCAP_SERVICES||"{}");

var twilioSid, twilioToken;
services['user-provided'].forEach(function(service) {
    if (service.name == 'Twilio-87') {
        twilioSid = service.credentials.accountSID;
        twilioToken = service.credentials.authToken;
    }
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/front-end'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.get('/twiliouth', function(req, res) {
  var toNum = req.param("number");
  var twilioMessage = req.param("message");

  // var toNum = "+12536422707";
  // var twilioMessage = "FROM BLUEMIX";
  var fromNum = '+13602343448';
  var client = new twilio.RestClient(twilioSid, twilioToken);

  // http://appointly.mybluemix.net/twiliouth?number=+12536422707&message=FROMBLUEMIXMOTHERFUCKER
  // client.messages.create({
  //     body: "FROM BLUEMIX",
  //     to  : "+12067909711",
  //     from: "+14696152255"
  //   }, function(err, message) {
  //   process.stdout.write(message.sid);
  // });

  client.sendMessage({
         to   : toNum,
         from : fromNum,
         body : twilioMessage
      }, function(err, message) {
         if (err) {
            console.error("Problem: " + message);
            res.send("Error: "+ message);
            return;
         } else {
            res.send("Done");
            console.log("Twilio msg sent from " +
              fromNum + " to " +
              toNum + ": " + twilioMessage);
         }
      }
   );
});




// app.get('/message', function (req, res) {
//     var client = new twilio.RestClient(twilioSid, twilioToken);
//
//     client.sendMessage({
//         to  :'+12067909711',
//         from:'+14696152255',
//         body:'Appointly!'
//     }, function(err, message) {
//         res.send('Message sent! ID: '+message.sid);
//     });
//
// });


// start server on the specified port and binding host
var server = app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
