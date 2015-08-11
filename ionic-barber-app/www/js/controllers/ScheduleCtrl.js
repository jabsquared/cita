app.controller("ScheduleCtrl", function($scope, $state, $ionicPopup, aptListener, $ionicSideMenuDelegate, barberInfo) {

  //Feilds
  $scope.schedule_info = {};
  $scope.schedule_info.alarm = true;
  $scope.today = new Date(Date.now());

  //Functions

  $scope.submitData = function() {
    console.log($scope.schedule_info.date);
    var barber_name = barberInfo.getBarber();
    $scope.schedule_info.date = new Date($scope.schedule_info.date);
    if ($scope.hasOwnProperty("appointments") !== true) {
      $scope.appointments = [];
    }
    localAptDB.put({
      _id: $scope.schedule_info.date.toISOString() + '-' + barber_name,
      client_name: $scope.schedule_info.client_name,
      client_phone: $scope.schedule_info.number,
      barber: barber_name,
      time: $scope.schedule_info.date,
      alarm: $scope.schedule_info.alarm,
      sms_0: false,
      sms_1: false,
      done: false
    }).then(function(response) {
      console.log('Complete!');
      // Show some pops up fancy stuffs here, also go back to login.
      console.log(response);
      $state.go('appointments');
    }).catch(function(err) {
      console.log(err);
    });
  };
});
