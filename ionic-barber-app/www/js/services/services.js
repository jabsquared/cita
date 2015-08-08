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
