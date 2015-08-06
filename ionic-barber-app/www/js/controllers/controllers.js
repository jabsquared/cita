app.controller("AccountCtrl", function($scope, $rootScope, $state) {
  console.log('in account controller');

  //Feilds
  $scope.barbers = [{
    name: "Gabino",
    desc: "Profesional Barber"
  }, {
    name: "Matt",
    desc: "Profesional Barber"
  }, {
    name: "Antonio",
    desc: "Profesional Barber"
  }];

  //Functions

    $scope.schedule = function(name) {
      $rootScope.barber = name;
      $state.go('appointments');
    }

});

app.controller("AppointmentsCtrl", function($scope, $state, $ionicPopup, $rootScope, aptListener) {

  // Feilds
  $scope.appointments = [];
  $scope.barber = $rootScope.barber;

  //Functions

  //Event Listeners
  $scope.$on('add', function(event, apt) {
    $scope.appointments.push(apt);
  });

  $scope.$on('delete', function(event, id) {
    for (var i = 0; i < $scope.appointments.length; i++) {
      if ($scope.appointments[i]._id === id) {
        $scope.appointments.splice(i, 1);
      }
    }
  });
});

app.controller("ScheduleCtrl", function($scope, $rootScope, $state, $ionicPopup, aptListener, $ionicSideMenuDelegate) {

  //Feilds
  $scope.schedule_info = {};
  $scope.schedule_info.alarm = true;
  $scope.today = new Date();

  //Functions

  $scope.submitData = function() {
    $scope.schedule_info.date = new Date($scope.schedule_info.date);
    if ($scope.hasOwnProperty("appointments") !== true) {
      $scope.appointments = [];
    }
    remoteAptDB.put({
      _id: $scope.schedule_info.date.toISOString() + '-' +  $rootScope.barber,
      client_name: $scope.schedule_info.client_name,
      client_phone: $scope.schedule_info.number,
      barber: $rootScope.barber,
      time: $scope.schedule_info.date,
      alarm: $scope.schedule_info.alarm,
      sms_0:  false,
      sms_1: false,
      done: false,
    }).then(function(response) {
      // Show some pops up fancy stuffs here, also go back to login.
      console.log(response);
      $state.go('appointments');
    }).catch(function(err) {
      console.log(err);
    });
  }

});
