'use strict';

var PouchDB = require('pouchdb');

var PouchUtils = require('./cita_pouchutils');

var moment = require('moment');

var aptDB = PouchUtils.aptDB;

var logDB = PouchUtils.logDB;

var InfiniteLoop = require('infinite-loop');

var il = new InfiniteLoop();

var barbers = ['Gabino', 'Matt', 'Antonio'];

var testIncomingAppointment = function TestIncomingAppointment() {
  // body...
  var tDate = moment().add(6,'s');

  var barber = barbers[Math.floor(Math.random() * barbers.length)];

  var slot = Math.floor(Math.random()*14);

  // console.log(tDate.format("YYYY-MM-DDTHH:mm:"));

  aptDB.put({
    _id: tDate.format() + '-' + barber + '-' + '0123456789',
    slot_num: slot,
    client_name: "LAB",
    client_phone: "0123456789",
    barber: barber,
    date: tDate.format('YYYY-MM-DD'),
    start_time: tDate.format('h:mm a'),
    end_time: tDate.add(5,'s').format('h:mm a'),
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

exports.tia = testIncomingAppointment;

exports.tifa = function Tifa() {
  il.add(testIncomingAppointment, []).setInterval(2700).run();
};

module.exports = exports;
