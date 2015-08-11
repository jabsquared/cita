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

app.factory('gabinoAptListener', function($rootScope, barberInfo) {
  localGabinosAptDB.changes({
    live: true
  }).on('change', function(change) {
    if (change.deleted) {
      $rootScope.$apply(function() {
        $rootScope.$broadcast('deleteGabinosApt', change.id);
      });
    } else {
      $rootScope.$apply(function() {
        // localGabinosAptDB.get(change.id, function(err, doc) {
        //   $rootScope.$apply(function() {
        //     if (err) console.log(err);
        //     $rootScope.$broadcast('addGabinosApt', doc);
        //   });
        // });
        localGabinosAptDB.allDocs({
          include_docs: true,
          endkey: barberInfo.getBarber()
        }).then(function(result) {
          $rootScope.$broadcast('addGabinosApt', result);
        }).catch(function(err) {
          console.log(err);
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

app.service('appointmentData', function(barberInfo) {
      // moment().add(i * 45, 'minutes');
      var today = new moment();
      today.hours(9);
      today.minutes(0);
      today.seconds(0);
      // var today_at_9 = new Date(yyyy, mm, dd, 09);
      // dates (years, months, days, hours, minutes, seconds, and milliseconds)
      // new Date(oldDateObj.getTime() + diff*60000);
      var appointments = [];
      for (var i = 0; i < 14; i++) {
        appointments[i] = {
          slot_num: i,
          start_time: today.add((45 * i), 'minutes').format('h:mm a'),
          end_time: today.add(45, 'minutes').format('h:mm a')
        };
        today.subtract((45 * i) + 45, 'minutes');
      }
      return {
        getApts: function() {
          return appointments;
        },
        getDBApts: function(theDate) {
              remoteGabinosAptDB.allDocs({
                include_docs: true,
                startkey: theDate,
                endkey: barberInfo.getBarber()
              }).then(function(result) {
                console.log('New Results: ');
                console.log(result);
                return result;
              }).catch(function(err) {
                console.log(err);
                return null;
              });
          }
        };
      });
