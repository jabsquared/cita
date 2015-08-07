var appointments = [];

app.controller("AccountCtrl", function($scope, $rootScope, $state, barberInfo) {
  console.log('in account controller');

  //Feilds
  $scope.barbers = barberInfo.getBarbers();

  //Functions
    $scope.schedule = function(name) {
      barberInfo.setBaber(name);
      console.log(barberInfo.getBarber());
      $state.go('appointments');
    }

});

app.controller("AppointmentsCtrl", function($scope, $state, $ionicPopup, $rootScope, aptListener, barberInfo) {

  // Feilds
  $scope.appointments = appointments;
  $scope.barber = barberInfo.getBarber();

  //Functions
  $scope.back = function() {
    $state.go('account');
  }

  $scope.schedule = function(){
    $state.go('schedule');
  }

  $scope.delete = function(id){
     var confirmPopup = $ionicPopup.confirm({
       title: 'Are you sure you want to cancel?',
      //  template: 'Are you sure you want to cancel this appointment?',
       buttons: [
       {
         text: 'Cancel',
         type: 'button-stable'
      },
       {
         text: '<b>Yes</b>',
         type: 'button-assertive',
       },
     ]
     });
     confirmPopup.then(function(res) {
       if(res) {
         remoteAptDB.get(id).then(function(doc) {
           return remoteAptDB.remove(doc);
         }).then(function (result) {
           // handle result
           console.log('Deleted Document!');
         }).catch(function (err) {
           console.log(err);
         });
       } else {
         //canceled
       }
     });
  }

  $scope.reschedule = function(id) {

  }

  //Event Listeners
  $scope.$on('add', function(event, apt) {
    console.log('Updating');
    appointments.push(apt);
    console.log("appts:");
    // console.log(appointments);
    console.log($scope.appointments);
  });

  $scope.$on('delete', function(event, id) {
    console.log('Deleting');
    for (var i = 0; i < appointments.length; i++) {
      if (appointments[i]._id === id) {
        appointments.splice(i, 1);
      }
    }
  });
});

app.controller("ScheduleCtrl", function($scope, $rootScope, $state, $ionicPopup, aptListener, $ionicSideMenuDelegate, barberInfo) {

  //Feilds
  $scope.schedule_info = {};
  $scope.schedule_info.alarm = true;
  $scope.today = new Date();

  //Functions

  $scope.submitData = function() {
    var barber_name = barberInfo.getBarber();
    $scope.schedule_info.date = new Date($scope.schedule_info.date);
    if ($scope.hasOwnProperty("appointments") !== true) {
      $scope.appointments = [];
    }
    remoteAptDB.put({
      _id: $scope.schedule_info.date.toISOString() + '-' +  barber_name,
      client_name: $scope.schedule_info.client_name,
      client_phone: $scope.schedule_info.number,
      barber: barber_name,
      time: $scope.schedule_info.date,
      alarm: $scope.schedule_info.alarm,
      sms_0:  false,
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
  }

});
