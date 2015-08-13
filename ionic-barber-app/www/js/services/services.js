app.factory('aptListener', function(barberInfo, $rootScope) {

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
