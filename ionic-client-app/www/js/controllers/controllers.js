app.controller("LoginCtrl", function($scope, $state, $rootScope, userData) {
  //Feilds
  $scope.data = {};

  localUserDB.get('app_user').then(function(doc) {
    $state.go('account');
  }).catch(function(err) {
    console.log(err);
  });

  //Functions
  $scope.login = function() {
    localUserDB.put({
      _id: "app_user",
      name: $scope.data.name,
      phone: $scope.data.phone
    }).then(function(response) {
      $state.go('account');
    }).catch(function(err) {
      console.log(err);
    });
  }
  $scope.fbLogin = function() {

  }
  $scope.signup = function() {
    $state.go('signup');
  }

  //Event Listeners
  // $scope.$on('add', function(event, user_info) {
  //
  // });
  //
  // $scope.$on('delete', function(event, id) {
  //
  // });

});

app.controller("SignupCtrl", function($scope, $state) {
  //Feilds
  $scope.data = {};

  //Functions
  $scope.cancel = function() {
    $state.go('login');
  }

  $scope.signup = function() {
    remoteUsersDB.signup($scope.data.username, $scope.data.password, {
      metadata: {
        email: $scope.data.email,
        name: $scope.data.name
      }
    }, function(err, response) {
      if (err) {
        if (err.name === 'conflict') {
          console.log($scope.data.username + ' already exists, choose another username.');
        } else if (err.name === 'forbidden') {
          console.log('invalid username');
        } else {
          console.log('HTTP error, cosmic rays, etc.');
        }
      } else {
        console.log(response);
      }
    });
  }

});

app.controller("AccountCtrl", function($scope, $rootScope, $state, barberListener) {

  //Feilds
  $scope.barbers = [];
  $scope.drop = false;
  $scope.drop2 = false;

  localUserDB.get('app_user').then(function(doc) {
    $scope.user = doc;
  }).catch(function(err) {
    console.log(err);
  });

  //Functions
  $scope.toggle = function(num) {
    if (num === 1) {
      $scope.drop = !$scope.drop;
    }

    $scope.schedule = function() {
      $state.go('schedule');
    }

    $scope.logout = function() {
      $rootScope.user = {};
      $state.go('login');
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
  $scope.$on('add', function(event, apt) {
    $scope.barbers.push(apt);
  });

  $scope.$on('delete', function(event, id) {
    for (var i = 0; i < $scope.barbers.length; i++) {
      if ($scope.barbers[i]._id === id) {
        $scope.barbers.splice(i, 1);
      }
    }
  });

});

app.controller("ScheduleCtrl", function($scope, $state, $ionicPopup, aptListener) {

  //Feilds
  $scope.appointments = [];
  $scope.schedule_info = {};
  $scope.schedule_info.alarm = false;

  //Functions
  $scope.submitData = function() {
    if ($scope.hasOwnProperty("appointments") !== true) {
      $scope.appointments = [];
    }
    remoteAptDB.post({
      user_id: '23554231512341',
      barber: $scope.schedule_info.barber,
      time: $scope.schedule_info.date.toString(),
      alarm: $scope.schedule_info.alarm,
      done: false,
    });
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
