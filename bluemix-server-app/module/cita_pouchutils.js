'use strict';
var secret = require('./cita_secret');

var PouchDB = require('pouchdb');

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

var putAppointment = function PutAppointment(aptDB, theD) {
  // body...
  aptDB.put({
    client_name: theD.client_name,
    client_phone: theD.client_phone,
    barber: theD.barber,
    time: new Date(theD.time),
    alarm: theD.alarm,
    sms_0: theD.sms_0,
    sms_1: theD.sms_1,
    done: theD.done,
  }, theD._id, theD._rev, function(err, response) {
    if (err) {
      return console.log(err);
    }
    // console.log(response);

    // sendsms(0, "+12067909711", "You have an Appoinment in 3 sec with " + theD.barber + " on " + ad.toTimeString());
    // sendsms(0, theD.client_phone, "From The Beau Barbershop: You have an appoinment with " + theD.barber + " on " + ad.toTimeString('en-US', {
    //   hour: '2-digit',
    //   minute: '2-digit'
    // }));
    // sendsms(0, theD.client_phone, "From The Beau Barbershop: You have an appoinment in 30 minutes with " +
    //   theD.barber + " on " +
    //   ad.toTimeString()
    //   // ad.toLocaleTimeString('en-US', {
    //   //   hour: '2-digit',
    //   //   minute: '2-digit'
    //   // })
    // );
  });
};

var deleteAppointment = function DeleteAppointment(aptDB, theD, logDB) {
  // body...
  putAppointment(logDB, theD);

  aptDB.remove(theD, function(err, response) {
    if (err) {
      return console.log(err);
    }
    // handle response
    // sendsms(0, cp, "From The Beau Barbershop: thank you and have a nice day!");
  });
};

exports.putAppointment = putAppointment;

exports.deleteAppointment = deleteAppointment;

module.exports = exports;
