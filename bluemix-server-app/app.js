/**
 * Module dependencies.
 */




var
  express = require('express'),
  cfenv = require('cfenv'),
  PouchDB = require('pouchdb');

var app = express();

var port = (process.env.VCAP_APP_PORT || 3000);

var vcapServices = JSON.parse(process.env.VCAP_SERVICES || "{}");

var aptDB =
  new PouchDB('https://patestediescruslyindowne:t8txxKMPF3MBDRWqmCndXc5d @af48ada6-78db-4210-a80d-86619c82407e-bluemix.cloudant.com/appointments/', {
    auth: {
      username: 'patestediescruslyindowne',
      password: 't8txxKMPF3MBDRWqmCndXc5d'
    }
  });
// new PouchDB("test"); // Local testing

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

// aptDB.destroy().then(function (response) {
//   // success
// }).catch(function (err) {
//   console.log(err);
// });


// Put a design doc into the db
var InfiniteLoop = require('infinite-loop');

var il = new InfiniteLoop;

var ReminderBot = function() {
  var nao = new Date();

  var naoymdh =
    // nao.toISOString().substring(0, 14); // YMDH
    nao.toISOString().substring(0, 17);

  // Filter by YMDH, client-side
  aptDB.allDocs({
    include_docs: true,
    startkey: naoymdh, //DATE (NoTime)
    endkey: naoymdh + "\uffff"
  }, function(err, response) {
    if (err) {
      return console.log(err);
    }
    // handle result
    // console.log("All The Responses:"); console.log(response);

    for (var i = 0; i < response.rows.length; i++) {

      // console.log("Responses on row " + i + " :");
      //   console.log(response.rows[i]);
      var theD = response.rows[i].doc;

      // console.log(theD);

      // If done return;
      if (!theD.alarm || theD.done) {
        return;
      }
      // The Appointment Date parsed into a Date Object
      var ad = new Date(theD.time);
      // console.log(ad);

      // If nao is > 6AM && 1st reminder == false

      // if sms0 is not done
      // Send Reminder SMS && sms0 = true

      // If nao is 30 minutes away && 2nd reminder == false
      // If nao is greater than (AppointmentTime - 30 MIN)



      if ((ad.getTime() - nao.getTime()) < 3 * 10 * 60 * 1000) { // In MILISEC TODO
        if (theD.sms_1)
          return;

        aptDB.put({
          client_name: theD.client_name,
          client_phone: theD.client_phone,
          barber: theD.barber,
          time: theD.time,
          alarm: theD.alarm,
          sms_0: theD.sms_0,
          sms_1: true,
          done: theD.done,
        }, theD._id, theD._rev, function(err, response) {
          if (err) {
            return console.log(err);
          }
          sendsms(0, "+12067909711", "You have an Appoinment in 3 sec with " + theD.barber + " on " + ad.toTimeString());
        });

      }
      // If sms1 is not done
      // Send Reminder SMS && sms1 = true

      // If Date.now is greater than appTime, Done = true
      // *****************************

    }

  });


}

il.add(ReminderBot, []).setInterval(3000).run();

// 1800000 for 30 minutes

var changes = aptDB.changes({
  since: 'now',
  live: true,
  include_docs: true
}).on('create', function(change) {
  // handle changeq

  var apt = change.doc;

  if (apt.barber == null)
    return

  var ad = new Date(apt.time);

  var msg = "From The Beau Brother: You scheduled a hair cut on " +
    ad.toDateString() + " at " +
    ad.toLocaleTimeString('en-US',{
      hour: '2-digit',
      minute: '2-digit'
    }) + " with " +
    apt.barber +
    ". Have a nice day, " + apt.client_name + "!";

  // sendsms(0, "+12067909711", msg);
  sendsms(0, apt.client_phone, msg);
  // sendsms(1, null, msg);

  // console.log(msg);
  // console.log(change);

}).on('complete', function(info) {
  // changes() was canceled
}).on('error', function(err) {
  console.log(err);
});

var twilio = require('twilio');

var twilioSid, twilioToken;

vcapServices['user-provided'].forEach(function(service) {
  // if (service.name == 'Twilio-9n') { // Release Twilio
  if (service.name == 'Twilio-79') { // Test Twilio
    twilioSid = service.credentials.accountSID;
    twilioToken = service.credentials.authToken;
  }
});

var sendsms = function(id, toNum, msg) {
  // var fromNum = '+13602343448';  // Bryan's #
  var fromNum = '+14696152255'; // LAB's free #

  if (toNum == null)
  // toNum = "+12067909711"; // Bogdan's #
    toNum = "+12536422707"; // LAB's #

  if (msg == null)
    msg = "FROM BLUEMIX";

  var client = new twilio.RestClient(twilioSid, twilioToken);

  client.sendMessage({
    to: toNum,
    from: fromNum,
    body: msg
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

var appEnv = cfenv.getAppEnv();

var server = app.listen(appEnv.port, appEnv.bind, function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
