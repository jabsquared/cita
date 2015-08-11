'use strict';

var PouchDB = require('pouchdb');

var PouchUtils = require('./cita_pouchutils');

var aptDB = PouchUtils.aptDB;

var logDB = PouchUtils.logDB;

var InfiniteLoop = require('infinite-loop');

var il = new InfiniteLoop();

var barbers = ['Gabino', 'Matt', 'Antonio'];

var testIncomingAppointment = function TestIncomingAppointment() {
  // body...
  var tDate = new Date();

  tDate.setTime(tDate.getTime() + 6000);

  var barber = barbers[Math.floor(Math.random() * barbers.length)];

  aptDB.put({
    _id: tDate.toISOString() + '-' + barber,
    client_name: "Trix",
    client_phone: "0123456789",
    barber: barber,
    time: tDate,
    alarm: true,
    sms_0: false,
    sms_1: false,
    done: false,
  }).then(function(response) {
    // Show some pops up fancy stuffs here, also go back to login.
    // console.log(response);
  }).catch(function(err) {
    console.log(err);
  });
};

il.add(testIncomingAppointment, []).setInterval(4500).run();

module.exports = exports;
