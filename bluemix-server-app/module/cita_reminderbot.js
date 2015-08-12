'use strict';

var PouchUtils = require('./cita_pouchutils');

var aptDB = PouchUtils.aptDB;

var logDB = PouchUtils.logDB;

var InfiniteLoop = require('infinite-loop');

var il = new InfiniteLoop();

var bm = 0;

var fi = 0;

var compareLogNFi = function(err, info) {
  if (err) {
    return console.log(err);
  }
  console.log("|" + (info.doc_count+1) + " d >---< f " + fi);
  // handle result
};

var SMSBot = function() {
  // Get the Current Date
  var nao = new Date();
  // console.log("|--- t = " + (++bm) + "s");
  // Extract the needed infomation from
  var naoymd =
    // nao.toISOString().substring(0, 11); // YMD
    nao.toISOString().substring(0, 13); // YMDH
  // nao.toISOString().substring(0, 15); // YMDHm
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
    // console.log("|    r = " + response.total_rows + "a");
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
      var ad = new Date(theD.date);
      // console.log(ad.getTime());
      // If nao is > 6AM && 1st reminder == false
      if (nao.getHours() >= 8 && !theD.sms_0) { // Skip if sms_0 has been sent
        var sms0 = ("From The Beau Barbershop: You have an appoinment with " + theD.barber + " on " +
          ad.toTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        );
        // Toggle sms0
        theD.sms_0 = true;
        // Put to DB then Send Reminder SMS
        PouchUtils.putAppointment(aptDB, theD, sms0);
      }
      // If nao is greater than (AppointmentTime - 30 MIN)
      // TODO:
      if ((ad.getTime() - nao.getTime()) < 60*3*999 && !theD.sms_1) { //Skip if sms_1 has been sent
        var sms1 = ("From The Beau Barbershop: You have an appoinment in 30 minutes with " +
          theD.barber + " on " +
          ad.toTimeString()
        );
        // Toggle sms1
        theD.sms_1 = true;
        // Put to DB then Send Reminder SMS
        PouchUtils.putAppointment(aptDB, theD, sms1);
      }

      // If nao is greater than appTime, Done = true
      if (nao.getTime() > ad.getTime()) {
        var smsDone = "From The Beau Barbershop: thank you and have a nice day!";

        // console.log("|--- f = " + (++fi) + "a");
        // logDB.info(compareLogNFi);

        theD.done = true;

        PouchUtils.deleteAppointment(aptDB, logDB, theD, smsDone);
      }
    }
  });
};

// Set Timer:
il.add(SMSBot, []).setInterval(9999).run();

// 1800000 for 30 minutes

var sender = require('./cita_twilio');

// Change Checker:
var changes = aptDB.changes({
  since: 'now',
  live: true,
  include_docs: true
}).on('create', function(change) {
  // handle change
  var theD = change.doc;

  if (theD.barber === null) {
    return;
  }

  var ad = new Date(theD.date);

  // console.log(ad.getTime());

  var instantSMS = "From The Beau Barbershop: You scheduled a hair cut on " +
    ad.toDateString() + " at " +
    ad.toTimeString() +
    " with " + theD.barber +
    ". Have a nice day, " + theD.client_name + "!";

  sender.SendSMS(theD.client_phone, instantSMS);
  // console.log(change);
}).on('update', function(change) {
  // console.log(change);
}).on('complete', function(info) {
  // changes() was canceled
}).on('error', function(err) {
  console.log(err);
});
