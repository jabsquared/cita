app.factory('aptListener', function(barberInfo) {
  var appointments = [];
  localAptDB.changes({
    live: true
  }).on('change', function(change) {
    var nao = moment().format().substring(0, 13);
    localAptDB.allDocs({
      include_docs: true,
      startkey: nao, //YMD
      endkey: barberInfo.getBarber()
    }, function(err, response) {
      if (err) {
        return console.log(err);
      }
      appointments = response.rows;
    });
  }).on('create', function(change) {

  }).on('delete', function(change) {

  });
  return true;
});

app.factory('barberInfo', function() {
  var barbers = [{
    name: "Gabino",
    desc: "Profesional Barber"
  }, {
    name: "Matt",
    desc: "Profesional Barber"
  }, {
    name: "Antonio",
    desc: "Profesional Barber"
  }];
  var barber = 'Gabino';
  return {
    setBaber: function(name) {
      barber = name;
    },
    getBarber: function() {
      return barber;
    },
    getBarbers: function() {
      return barbers;
    }
  };
});

app.service('appointmentData', function(barberInfo) {
  // moment().add(i * 45, 'minutes');
  return {
    getApts: function() {
      var today = new moment();
      today.hours(9);
      today.minutes(0);
      today.seconds(0);
      var appointments = [];
      for (var i = 0; i < 14; i++) {
        appointments[i] = {
          slot_num: i,
          start_time: today.add((45 * i), 'minutes').format('h:mm a'),
          end_time: today.add(45, 'minutes').format('h:mm a')
        };
        today.subtract((45 * i) + 45, 'minutes');
      }
      return appointments;
    },
    getDBApts : function(theDate, process) {
      console.log('the date: ' + theDate);
      localAptDB.allDocs({
        include_docs: true,
        startkey: theDate,
        endkey: barberInfo.getBarber()
      }).then(function(result) {
        console.log(result);
        process(result);
        return result;
      }).catch(function(err) {
        console.log(err);
        return null;
      });
    }
  };
});
