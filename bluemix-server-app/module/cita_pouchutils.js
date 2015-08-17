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

var logAppointment = function LogAppointment(logDB, theD) {
  logDB.put({
    _id: theD._id,
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
  }, function(err, response) {
    if (err) {
      return console.log(err);
    }
    // console.log(response);
    return;
  });
};

var updateLog = function updateLog(logDB, theD) {
  logDB.get(theD._id, function(err, doc) {
    if (err) {
      return console.log(err);
    }
    logDB.put({
      _id: theD._id,
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
    }, theD._id, doc._rev, function(err, response) {
      if (err) {
        return console.log(err);
      }
      // handle response
    });
  });
};

var deleteAppointment = function DeleteAppointment(aptDB, logDB, theD, msg) {
  // body...
  updateLog(logDB, theD);

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

exports.logAppointment = logAppointment;

exports.updateLog = updateLog;

module.exports = exports;
