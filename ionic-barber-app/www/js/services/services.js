
app.factory('barberInfo', function() {
  var barbers = [{
    name: 'Antonio',
    desc: 'Profesional Barber',
  },{
    name: 'Gabino',
    desc: 'Profesional Barber',
  }, {
    name: 'Matt',
    desc: 'Profesional Barber',
  },];

  var barber = 'Gabino';
  return {
    setBaber: function(name) {
      console.log('Setting Name');
      barber = name;
      console.log('Name: ' + barber);
    },

    getBarber: function() {
      return barber;
    },

    getBarbers: function() {
      return barbers;
    },

  };
});
