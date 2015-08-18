'use strict';

var secret = require('./cita_secret');

var twilio = require('twilio');

if (secret.twilioAuth.sID!=="lab"){
  var client = new twilio.RestClient(
    secret.twilioAuth.sID,
    secret.twilioAuth.token
  );
}

var lab = false;

var sendSMS = function SendSMS(toNum, msg) {
  if (secret.twilioAuth.sID==="lab"||lab) {
    console.log(msg);
    return;
  }
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
    from: secret.twilioAuth.fromNum,
    body: msg
  }, function(err, message) {
    if (err) {
      console.error("Problem: " + message);
      console.log("Error: " + err);
      console.log("Msg: "+ msg);
      sendSMS(null, err + ":" + message);
      return;
    }
    console.log("|--------- SentSMS ---------|");
    console.log(toNum);
    console.log(msg);
    console.log("|---------------------------|");

  });
};

exports.SendSMS = sendSMS;

module.exports = exports;
