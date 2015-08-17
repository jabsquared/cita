'use strict';

var twilioAuth = {
  sID: "lab"
};
var cloudantAuth = {
  url: "lab"
};

// Check if ENV from BLUEMIX exist
if (process.env.VCAP_SERVICES) {
  var vcapServices = JSON.parse(process.env.VCAP_SERVICES || "{}");

  // Get the 1st Cloudant credential
  var cred = vcapServices.cloudantNoSQLDB[0].credentials;

  // cloudantAuth.host = cred.host;
  // cloudantAuth.port = cred.port;

  // Get needed information for PouchDB
  cloudantAuth.user = cred.username;
  cloudantAuth.pass = cred.password;
  cloudantAuth.url = cred.url;

  // Get all of user-provided things, in which check for Twilio
  vcapServices['user-provided'].forEach(function(service) {
    // if (service.name === 'Twilio-9n') { // Release Twilio
    if (service.name === 'Twilio-79') { // Test Twilio
      twilioAuth.sID = service.credentials.accountSID;
      twilioAuth.token = service.credentials.authToken;
    }
  });
}

// Export keys
exports.twilioAuth = twilioAuth;
exports.cloudantAuth = cloudantAuth;
module.exports = exports;
