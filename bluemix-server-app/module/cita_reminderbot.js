'use strict';

var PouchUtils = require('./cita_pouchutils');

var aptDB = PouchUtils.aptDB;

var logDB = PouchUtils.logDB;

var moment = require('moment-timezone');

var sender = require('./cita_twilio');

var header = 'From The Beau Barbershop: ';

// Change Checker:
var checkChanges = function CheckChanges(argument) {
  aptDB.changes({
    since: 'now',
    live: true,
    INCLUDE_DOCS: true,

    // include_docs: true,
  }).on('create', function(info) {
    console.log('Something Changed!');

    // handle change
    var theD = info.doc;

    // console.log('New Doc Added!');
    // console.log(info);
    var ad = moment(info.id, 'YYYY-MM-DDTHH:mm:ssZ')
      .tz('America/Vancouver');
    if (theD.barber === null) {
      return;
    }

    // console.log(theD);

    PouchUtils.logAppointment(logDB, theD);

    var instantSMS =
      header + 'You scheduled a hair cut on ' +
      ad.format('dddd, MMMM Do YYYY') + ' at ' +
      ad.format('h:mm A') +
      ' with ' + theD.barber +
      '! Have a nice day ' + theD.clientName + ' :)';

    sender.SendSMS(theD.clientPhone, instantSMS);
  }).on('delete', function(info) {
    // Send some goodbye SMS here
    // console.log(info);
    var nao = moment().tz('America/Vancouver');
    var id = info.id;
    var tel = id.substring(id.length - 10);
    var ad = moment(id, 'YYYY-MM-DDTHH:mm:ssZ').tz('America/Vancouver');
    if (ad.diff(nao) > 999) {
      var cancelSMS = header + 'Your appointment on ' +
        ad.format('dddd, MMMM Do YYYY') + ' at ' +
        ad.format('h:mm A') +
        ' has been canceled! Have a nice day :)';
      sender.SendSMS(tel, cancelSMS);
    }
  }).on('update', function(change) {
    // console.log(change);
  }).on('complete', function(info) {
    // changes() was canceled
    console.log(info);
  }).on('error', function(err) {
    console.log(err);
  });
};

var bm = 0;
var fi = 0;
var compareLogNFi = function(err, info) {
  if (err) {
    return console.log(err);
  }

  console.log('|' + (info.DOC_COUNT + 1) + ' d >---< f ' + fi);

  // handle result

};

var SMSBot = function(t1, tdel) {
  // Get the Current Date
  var nao = moment().tz('America/Vancouver');

  // console.log(nao.format());
  // console.log('|--- t = ' + (++bm) + 's');
  // Extract the needed infomation from
  var naoymd =
    nao.format('YYYY-MM-DDT'); // YMD
  // nao.format('YYYY-MM-DDTHH:'); // YMDH
  // nao.format('YYYY-MM-DDTHH:m'); // YMDHm
  // nao.format('YYYY-MM-DDTHH:mm:'); // YMDHM
  // Filter by YMDH, client-side
  // console.log(naoymd);
  aptDB.allDocs({
    // include_docs: true,
    INCLUDE_DOCS: true,
    startkey: naoymd, //YMD
    endkey: naoymd + '\uffff',
  }, function(err, response) {
    if (err) {
      return console.log(err);
    }

    // console.log('All The Responses:'); console.log(response);
    // console.log('|    r = ' + response.total_rows + 'a');
    // Go through all messages for the last D || H || M
    for (var i = 0; i < response.rows.length; i++) {
      // console.log('Responses on row ' + i + ' :'); console.log(response.rows[i]);
      var theD = response.rows[i].doc;

      // console.log(theD);
      // If nao is greater than appTime, Done = true
      // console.log(nao.diff(ad));
      // If done return;
      if (!theD.alarm || theD.done) {
        return;
      }

      // The Appointment Date parsed into a Date Object
      var ad = moment(theD._id, 'YYYY-MM-DDTHH:mm:ssZ')
        .tz('America/Vancouver');

      // console.log(ad);

      // If nao is greater than (AppointmentTime - 30 MIN)
      // TODO:
      // console.log(ad.diff(nao));

      // If nao is > 6AM && 1st reminder == false
      // Skip if sms_0 has been sent
      if (nao.hours() >= 6 && !theD.sms0) {
        var sms0 =
          header + 'You have an appoinment with ' +
          theD.barber + ' at ' +
          ad.format('h:mm A') +
          '. Good morning, ' + theD.clientName + ' :)';

        // Toggle sms0
        theD.sms0 = true;

        // Put to DB then Send Reminder SMS
        PouchUtils.putAppointment(aptDB, theD, sms0);
        return;
      }

      //Skip if sms_1 has been sent
      // if (ad.diff(nao) < 30 * 60 * 999 && !theD.sms_1) {
      if (ad.diff(nao) < t1 && !theD.sms1) {
        var sms1 =
          header + 'You have an appoinment in ' +
          (t1 / 60000) + ' minutes with ' +
          theD.barber + ' at ' +
          ad.format('h:mm A') +
          '. Have a great day ' + theD.clientName + ' :D';

        // Toggle sms1
        theD.sms1 = true;

        // Put to DB then Send Reminder SMS
        PouchUtils.putAppointment(aptDB, theD, sms1);
        return;
      }

      if (nao.diff(ad) > tdel && !theD.done) {
        // var smsDone = header + 'Thank you ' + theD.client_name + ' and have a great day :)';

        // console.log('|--- f = ' + (++fi) + 'a');
        // logDB.info(compareLogNFi);
        theD.done = true;

        // PouchUtils.deleteAppointment(aptDB, logDB, theD, smsDone);
        PouchUtils.deleteAppointment(aptDB, logDB, theD, null);
        return;
      }
    }
  });
};

exports.SMS = SMSBot;
exports.CheckChanges = checkChanges;
module.exports = exports;
