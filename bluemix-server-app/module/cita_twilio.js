var twilio = require('twilio');

var twilioSid, twilioToken;

if (!dev) {
  vcapServices['user-provided'].forEach(function(service) {
    // if (service.name == 'Twilio-9n') { // Release Twilio
    if (service.name == 'Twilio-79') { // Test Twilio
      twilioSid = service.credentials.accountSID;
      twilioToken = service.credentials.authToken;
    }
  });
}

var sendsms = function(id, toNum, msg) {

  if (dev) {
    console.log(msg);
    return;
  }

  // var fromNum = '+13602343448';  // Bryan's #
  var fromNum = '+14696152255'; // LAB's free #

  if (!toNum)
  // toNum = "+12067909711"; // Bogdan's #
    toNum = "+12536422707"; // LAB's #

  if (toNum[0] !== "+")
    toNum = "+1" + toNum;

  if (!msg)
    msg = "From jabSquared";

  var client = new twilio.RestClient(twilioSid, twilioToken);

  client.sendMessage({
    to: toNum,
    from: fromNum,
    body: msg
  }, function(err, message) {
    if (err) {
      console.error("Problem: " + message);
      console.log("Error: " + message);
      sendsms(1, null, msg);
      return;
    } else {
      console.log("Done");
    }
  });
}
