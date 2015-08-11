'use strict';

var secret = require('./cita_secret');

var twilio = require('twilio');

if (secret.twilioAuth.sID!=="lab"){
  var client = new twilio.RestClient(
    secret.twilioAuth.sID,
    secret.twilioAuth.token);
}

var sendSMS = function SendSMS(toNum, msg) {
  if (secret.twilioAuth.sID==="lab") {
    console.log(msg);
    return;
  }
  // var fromNum = '+13602343448';  // Bryan's #
  var fromNum = '+14696152255'; // LAB's free #
  if (!toNum) {
    // toNum = "+12067909711"; // Bogdan's #
    toNum = "+12536422707"; // LAB's #
  }
  // Add Country Code
  if (toNum[0] !== "+") {
    toNum = "+1" + toNum;
  }
  // Blank Message?
  if (!msg) {
    msg = "From The Beau Barbershop: jabSquared!";
  }
  //
  client.sendMessage({
    to: toNum,
    from: fromNum,
    body: msg
  }, function(err, message) {
    if (err) {
      console.error("Problem: " + message);
      console.log("Error: " + message);
      sendSMS(null, msg);
      sendSMS(null, msg);
      return;
    } else {
      console.log("Done");
    }
  });
};

exports.SendSMS = sendSMS;

module.exports = exports;
