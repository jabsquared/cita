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
  $scope.newDate = { date: new Date()};

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
         onTap: function(e){
           return true;
         }
       },
     ]
     });
     confirmPopup.then(function(res) {
       console.log(res);
       if(res) {
         console.log('about to delete');
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
         console.log('canceled!');
       }
     });
  }

  $scope.reschedule = function(apt) {
    console.log('reschedule!');
    $scope.data = {}
    // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="datetime-local" ng-model="newDate.date">',
     title: 'Choose new date and time.',
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       onTap: function(e) {
           return 'cancel button'
         }
      },
       {
         text: '<b>Confirm</b>',
         type: 'button-assertive',
         onTap: function(e) {
          //  alert($scope.newDate.date);
           if (!$scope.newDate.date) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return 'submit';
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
    //  alert($scope.newDate.date);
     console.log(res);
     if (res === 'submit'){
       remoteAptDB.put({
         _id: apt._id,
         _rev: apt._rev,
         client_name: apt.client_name,
         client_phone: apt.client_phone,
         barber: apt.barber,
         time: $scope.newDate.date,
         alarm: apt.alarm,
         sms_0:  apt.sms_0,
         sms_1: apt.sms_1,
         done: apt.done
       }).then(function(response) {
       // handle response
       console.log('Reschedule Successful');
     }).catch(function (err) {
       console.log(err);
     });
   }
   });
  };

  //Event Listeners
  $scope.$on('add', function(event, apt) {
    console.log('Updating');
    for (var i = 0; i < appointments.length; i++) {
      if (appointments[i]._id === apt._id){
          appointments.splice(i, 1);
      }
    }
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
    console.log($scope.schedule_info.date);
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
