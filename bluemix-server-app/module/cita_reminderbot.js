// SMS BOT
var InfiniteLoop = require('infinite-loop');
var PouchDB = require('pouchdb');

var aptDB = new PouchDB("appointments"); // Local testing

var il = new InfiniteLoop();

var ReminderBot = function() {
  var nao = new Date();

  var naoymd =
    // nao.toISOString().substring(0, 11); // YMD
  // nao.toISOString().substring(0, 13); // YMDH
  nao.toISOString().substring(0, 17); // YMDHM

  // Filter by YMDH, client-side
  aptDB.allDocs({
    include_docs: true,
    startkey: naoymd, //YMD
    endkey: naoymd + "\uffff"
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
      if (nao.getHours() >= 6) {
        if (theD.sms_0) {
          return;
        }
        console.log("From The Beau Barbershop: You have an appoinment with " + theD.barber + " on " + ad.toTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }));
      }
      // if sms0 is not done
      // Send Reminder SMS && sms0 = true

      // If nao is 30 minutes away && 2nd reminder == false
      // If nao is greater than (AppointmentTime - 30 MIN)

      if ((ad.getTime() - nao.getTime()) < 3 * 10 * 60 * 1000) { // In MILISEC TODO
        if (theD.sms_1) {
          return;
        }
        console.log(theD.client_phone, "From The Beau Barbershop: You have an appoinment in 30 minutes with " +
          theD.barber + " on " +
          ad.toTimeString());

      }
      // If sms1 is not done
      // Send Reminder SMS && sms1 = true

      // If nao is greater than appTime, Done = true

      if (nao.getTime() > ad.getTime()) {
        var cp = theD.client_phone;
        console.log("DONE");
      }
      // *****************************
    }
  });

};

il.add(ReminderBot, []).setInterval(9000).run();

// 1800000 for 30 minutes
