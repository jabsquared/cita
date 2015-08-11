app.controller("AccountCtrl", function($scope, $rootScope, $state, barberInfo) {
  console.log('in account controller');

  //Feilds
  $scope.barbers = barberInfo.getBarbers();

  //Functions
  $scope.schedule = function(name) {
    barberInfo.setBaber(name);
    console.log(barberInfo.getBarber());
    $state.go('appointments');
  };

});
