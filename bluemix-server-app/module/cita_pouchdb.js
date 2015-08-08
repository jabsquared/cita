var PouchDB = require('pouchdb');

var aptDB = dev ?
  new PouchDB("test") : // Local testing
  new PouchDB('https://patestediescruslyindowne:t8txxKMPF3MBDRWqmCndXc5d @af48ada6-78db-4210-a80d-86619c82407e-bluemix.cloudant.com/appointments/', {
    auth: {
      username: 'patestediescruslyindowne',
      password: 't8txxKMPF3MBDRWqmCndXc5d'
    }
  });

var changes = aptDB.changes({
  since: 'now',
  live: true,
  include_docs: true
}).on('create', function(change) {
  // handle change
  var apt = change.doc;

  if (apt.barber == null)
    return

  var ad = new Date(apt.time);

  var msg = "From The Beau Barbershop: You scheduled a hair cut on " +
    ad.toDateString() + " at " +
    ad.toTimeString() +
    // ad.toLocaleTimeString('en-US', {
    //   hour: '2-digit',
    //   minute: '2-digit'
    // }) +
    " with " +  apt.barber +
    ". Have a nice day, " + apt.client_name + "!";

  // sendsms(0, "+12067909711", msg);
  sendsms(0, apt.client_phone, msg);

  // console.log(msg);
  // console.log(change);
}).on('update',function (change) {
  console.log(change);
}).on('complete', function(info) {
  // changes() was canceled
}).on('error', function(err) {
  console.log(err);
});
