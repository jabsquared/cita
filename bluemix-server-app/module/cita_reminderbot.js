'use strict';

var secret = require('./cita_secret');

var PouchUtils = require('./cita_pouchutils');

var aptDB = PouchUtils.aptDB;

var logDB = PouchUtils.logDB;

var InfiniteLoop = require('infinite-loop');

var il = new InfiniteLoop();

var sender = require('./cita_twilio');

var SMSBot = function() {
  // Get the Current Date
  var nao = new Date();
  // Extract the needed infomation from
  var naoymd =
    // nao.toISOString().substring(0, 11); // YMD
    // nao.toISOString().substring(0, 13); // YMDH
    nao.toISOString().substring(0, 15); // YMDHm
    // nao.toISOString().substring(0, 17); // YMDHM
  // Filter by YMDH, client-side
  aptDB.allDocs({
    include_docs: true,
    startkey: naoymd, //YMD
    endkey: naoymd + "\uffff"
  }, function(err, response) {
    if (err) {
      return console.log(err);
    }
    // console.log("All The Responses:"); console.log(response);
    // Go through all messages for the last D || H || M
    for (var i = 0; i < response.rows.length; i++) {
      // console.log("Responses on row " + i + " :"); console.log(response.rows[i]);
      var theD = response.rows[i].doc;

      // console.log(theD);

      // If done return;
      if (!theD.alarm || theD.done) {
        return;
      }
      // The Appointment Date parsed into a Date Object
      var ad = new Date(theD.time);
      // console.log(ad.getTime());
      // If nao is > 6AM && 1st reminder == false
      if (nao.getHours() >= 6 && !theD.sms_0) { // Skip if sms_0 has been sent
        console.log("From The Beau Barbershop: You have an appoinment with " + theD.barber + " on " +
          ad.toTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        );
        // Toggle sms0
        theD.sms_0 = true;
        // Put to DB then Send Reminder SMS
        PouchUtils.putAppointment(aptDB, theD);
      }
      // If nao is greater than (AppointmentTime - 30 MIN)
      console.log(ad.getTime() - nao.getTime());
      // TODO:
      if ((ad.getTime() - nao.getTime()) < 999 && !theD.sms_1) { //Skip if sms_1 has been sent
        console.log(theD.client_phone, "From The Beau Barbershop: You have an appoinment in 30 minutes with " +
          theD.barber + " on " +
          ad.toTimeString()
        );
        // Toggle sms1
        theD.sms_1 = true;
        // Put to DB then Send Reminder SMS
        PouchUtils.putAppointment(aptDB, theD);
      }

      // If nao is greater than appTime, Done = true
      if (nao.getTime() > ad.getTime()) {
        var cp = theD.client_phone;

        theD.done = true;

        PouchUtils.deleteAppointment(aptDB, theD, logDB);

        console.log("DONE");
      }
    }
  });
};

// Set Timer:
il.add(SMSBot, []).setInterval(1000).run();

// 1800000 for 30 minutes

// Change Checker:
var changes = aptDB.changes({
  since: 'now',
  live: true,
  include_docs: true
}).on('create', function(change) {
  // handle change
  var apt = change.doc;

  if (apt.barber === null) {
    return;
  }

  var ad = new Date(apt.time);

  // console.log(ad.getTime());

  var msg = "From The Beau Barbershop: You scheduled a hair cut on " +
    ad.toDateString() + " at " +
    ad.toTimeString() +
    // ad.toLocaleTimeString('en-US', {
    //   hour: '2-digit',
    //   minute: '2-digit'
    // }) +
    " with " + apt.barber +
    ". Have a nice day, " + apt.client_name + "!";

  // sendsms(0, "+12067909711", msg);
  // sendsms(0, apt.client_phone, msg);

  console.log(msg);

  // console.log(change);
}).on('update', function(change) {
  // console.log(change);
}).on('complete', function(info) {
  // changes() was canceled
}).on('error', function(err) {
  console.log(err);
});
