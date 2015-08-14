'use strict';
var sender = require('./cita_twilio');

var secret = require('./cita_secret');

var PouchDB = require('pouchdb');

// var moment = require('moment');

exports.aptDB = (secret.cloudantAuth.url === "lab") ?
  new PouchDB("lab/apm") : // Local testing
  new PouchDB(secret.cloudantAuth.url + "/appointments", {
    auth: {
      username: secret.cloudantAuth.user,
      password: secret.cloudantAuth.pass,
    }
  });

exports.logDB = (secret.cloudantAuth.url === "lab") ?
  new PouchDB("lab/log") : // Local testing
  new PouchDB(secret.cloudantAuth.url + "/logs", {
    auth: {
      username: secret.cloudantAuth.user,
      password: secret.cloudantAuth.pass,
    }
  });

var putAppointment = function PutAppointment(aptDB, theD, msg) {
  // body...
  // var k = moment(theD.time);
  aptDB.put({
    slot_num: theD.slot_num,
    client_name: theD.client_name,
    client_phone: theD.client_phone,
    barber: theD.barber,
    date: theD.date,
    start_time: theD.start_time,
    end_time: theD.end_time,
    alarm: theD.alarm,
    sms_0: theD.sms_0,
    sms_1: theD.sms_1,
    done: theD.done,
  }, theD._id, theD._rev, function(err, response) {
    if (err) {
      return console.log(err);
    }
    // console.log(response);
    if (msg) {
      sender.SendSMS(theD.client_phone, msg);
    }
    return;
  });
};

var deleteAppointment = function DeleteAppointment(aptDB, logDB, theD, msg) {
  // body...
  putAppointment(logDB, theD, null);

  aptDB.remove(theD, function(err, response) {
    if (err) {
      return console.log(err);
    }
    if (msg) {
      sender.SendSMS(theD.client_phone, msg);
    }
    return;
  });
};

exports.putAppointment = putAppointment;

exports.deleteAppointment = deleteAppointment;

module.exports = exports;
