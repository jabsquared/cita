/**
 * Module dependencies.
 */

var
  express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  https = require('https'),
  path = require('path'),
  fs = require('fs'),
  cfenv = require('cfenv');

var app = express();

var db;
var cloudant;
var dbCredentials = {
  dbName: 'my_sample_db'
};

var twilio = require('twilio');

var port = (process.env.VCAP_APP_PORT || 3000);

var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var twilioSid, twilioToken;
services['user-provided'].forEach(function(service) {
  if (service.name == 'Twilio-9n') {
    twilioSid = service.credentials.accountSID;
    twilioToken = service.credentials.authToken;
  }
});

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'FunnyGuyWearingAHat'
}));

app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(__dirname + '/front-end'));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

function initDBConnection() {

  if (process.env.VCAP_SERVICES) {
    var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    if (vcapServices.cloudantNoSQLDB) {
      dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
      dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
      dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
      dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
      dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;
    }
    console.log('VCAP Services: ' + JSON.stringify(process.env.VCAP_SERVICES));
  } else {
    dbCredentials.host = "af48ada6-78db-4210-a80d-86619c82407e-bluemix.cloudant.com";
    dbCredentials.port = 443;
    dbCredentials.user = "hislyedifterecoverandily";
    dbCredentials.password = "tS4ndjROhtDlJ2LECkcNvikl";
    dbCredentials.url = "https://hislyedifterecoverandily:tS4ndjROhtDlJ2LECkcNvikl@af48ada6-78db-4210-a80d-86619c82407e-bluemix.cloudant.com";

  }

  cloudant = require('cloudant')(dbCredentials.url);

  //check if DB exists if not create
  cloudant.db.create(dbCredentials.dbName, function(err, res) {
    if (err) {
      console.log('could not create db ', err);
    }
  });
  db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();


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

// https.createServer(app).listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
// });

var appEnv = cfenv.getAppEnv();

var server = app.listen(appEnv.port, appEnv.bind, function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
