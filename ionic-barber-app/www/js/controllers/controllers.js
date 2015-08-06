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

  $scope.drop = false;
  $scope.drop2 = false;

  //Functions
  $scope.toggle = function(num) {
    if (num === 1) {
      $scope.drop = !$scope.drop;
    }

    $scope.schedule = function() {
      console.log('hit!');
      $state.go('schedule');
    }
  }

  // $scope.submitData = function() {
  //   if ($scope.hasOwnProperty("barbers") !== true) {
  //     $scope.barbers = [];
  //   }
  //   remoteBarberDB.post({
  //       name: 'Gambino',
  //       desc: 'This is where the barbers description would go. Their favorite styles to work with, history, and other information would all by written here. Maybe a short bio or something... idk. Lets add one more sentance to finish it off ;)'
  //   });
  // }

  //Event Listeners
  // $scope.$on('add', function(event, apt) {
  //   $scope.barbers.push(apt);
  // });
  //
  // $scope.$on('delete', function(event, id) {
  //   for (var i = 0; i < $scope.barbers.length; i++) {
  //     if ($scope.barbers[i]._id === id) {
  //       $scope.barbers.splice(i, 1);
  //     }
  //   }
  // });

});

app.controller("ScheduleCtrl", function($scope, $state, $ionicPopup, $rootScope, aptListener, $ionicSideMenuDelegate) {

  $scope.appointments = [];

  $scope.schedule_info = {};
  $scope.schedule_info.alarm = true;
  $scope.today = new Date();

  //Functions

  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.submitData = function() {
    $scope.schedule_info.date = new Date($scope.schedule_info.date);
    if ($scope.hasOwnProperty("appointments") !== true) {
      $scope.appointments = [];
    }
    remoteAptDB.put({
      _id: 'Bogdan' + $scope.schedule_info.date,
      client_name: $scope.schedule_info.client_name,
      client_phone: $scope.schedule_info.number,
      barber: 'Bogdan',
      time: $scope.schedule_info.date,
      alarm: $scope.schedule_info.alarm,
      sms_0:  false,
      sms_1: false,
      done: false,
    }).then(function(response) {
      // Show some pops up fancy stuffs here, also go back to login.
      console.log(response);
    }).catch(function(err) {
      console.log(err);
    });;
  }

  $scope.logout = function() {
    $state.go('login');
  }

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
