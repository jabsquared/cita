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

aptDB.put({
  client_name: theD.client_name,
  client_phone: theD.client_phone,
  barber: theD.barber,
  time: ad,
  alarm: theD.alarm,
  sms_0: true,
  sms_1: theD.sms_1,
  done: theD.done,
}, theD._id, theD._rev, function(err, response) {
  if (err) {
    return console.log(err);
  }
  // sendsms(0, "+12067909711", "You have an Appoinment in 3 sec with " + theD.barber + " on " + ad.toTimeString());
  sendsms(0, theD.client_phone, "From The Beau Barbershop: You have an appoinment with " + theD.barber + " on " + ad.toTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }));
});

aptDB.put({
  client_name: theD.client_name,
  client_phone: theD.client_phone,
  barber: theD.barber,
  time: ad,
  alarm: theD.alarm,
  sms_0: theD.sms_0,
  sms_1: true,
  done: theD.done,
}, theD._id, theD._rev, function(err, response) {
  if (err) {
    return console.log(err);
  }
  // sendsms(0, "+12067909711", "You have an Appoinment in 3 sec with " + theD.barber + " on " + ad.toTimeString());
  sendsms(0, theD.client_phone, "From The Beau Barbershop: You have an appoinment in 30 minutes with " +
    theD.barber + " on " +
    ad.toTimeString()
    // ad.toLocaleTimeString('en-US', {
    //   hour: '2-digit',
    //   minute: '2-digit'
    // })
  );
});

aptDB.remove(thD, function(err, response) {
  if (err) {
    return console.log(err);
  }
  // handle response
  sendsms(0, cp, "From The Beau Barbershop: thank you and have a nice day!");
});
