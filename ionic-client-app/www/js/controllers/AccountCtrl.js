app.controller("AccountCtrl", function($scope, $rootScope, $state, barberInfo, UserData, Auth) {
  console.log('in account controller');

  //Feilds
  $scope.barbers = barberInfo.getBarbers();

  //Functions
  $scope.schedule = function(name) {
    barberInfo.setBaber(name);
    console.log(barberInfo.getBarber());
    $state.go('appointments');
  };

  $scope.logout = function(){
    Auth.$unauth();
    UserData.clearUser();
    $state.go('oauth');
  };

});
