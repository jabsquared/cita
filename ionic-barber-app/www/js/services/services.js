app.factory('aptListener', function($rootScope) {
  localAptDB.changes({
    live: true
  }).on('change', function(change) {
    if (change.deleted) {
      $rootScope.$apply(function() {
        $rootScope.$broadcast('delete', change.id);
      });
    } else {
      $rootScope.$apply(function() {
        localAptDB.get(change.id, function(err, doc) {
          $rootScope.$apply(function() {
            if (err) console.log(err);
            $rootScope.$broadcast('add', doc);
          });
        });
      });
    }
  }).on('create', function(change) {

  }).on('delete', function(change) {

  });
  return true;
});

app.factory('gabinoAptListener', function($rootScope) {
  localGabinosAptDB.changes({
    live: true
  }).on('change', function(change) {
    if (change.deleted) {
      $rootScope.$apply(function() {
        $rootScope.$broadcast('deleteGabinosApt', change.id);
      });
    } else {
      $rootScope.$apply(function() {
        localGabinosAptDB.get(change.id, function(err, doc) {
          $rootScope.$apply(function() {
            if (err) console.log(err);
            $rootScope.$broadcast('addGabinosApt', doc);
          });
        });
      });
    }
  }).on('create', function(change) {

  }).on('delete', function(change) {

  });
  return true;
});

app.factory('barberInfo', function($rootScope) {
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
  var barber = '';
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

app.service('appointmentData', function() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth(); //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var today_at_9 = new Date(yyyy, mm, dd, 09);
  // dates (years, months, days, hours, minutes, seconds, and milliseconds)
  // new Date(oldDateObj.getTime() + diff*60000);
  var appointments = [];
  for (var i = 0; i < 14; i++) {
    appointments[i] = {
      slot_num: i,
      start_time: new Date(today_at_9.getTime() + ((45 * i) * 60000)),
      end_time: new Date(new Date(this.start_time).getTime() + (45 * 60000))
    };
  }
  return {
    getApts: function() {
      return appointments;
    }
  };
});
