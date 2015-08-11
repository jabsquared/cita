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
  };

});

app.controller("AppointmentsCtrl", function($scope, $state, $ionicPopup, $rootScope, aptListener, barberInfo, appointmentData, gabinoAptListener) {



  // Initailize Appointments
  // Feilds
  $scope.appointments = appointments = appointmentData.getApts();
  // $scope.appointments = appointmentData.getApts(new Date(yyyy, mm, dd));
  $scope.schedule_info = {};
  $scope.schedule_info.alarm = true;
  $scope.today = new Date();
  $scope.data = {};

  //Functions
  $scope.back = function() {
    $state.go('account');
  };


  $scope.schedule = function() {
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.name" placeholder="Full Name"> <br/> <input type="tel" ng-model="data.phone" placeholder="phone number">',
      title: 'Choose new date and time.',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
        onTap: function(e) {
          return 'cancel button';
        }
      }, {
        text: '<b>Confirm</b>',
        type: 'button-assertive',
        onTap: function(e) {
          //  alert($scope.newDate.date);
          if (!$scope.data.name || !$scope.data.phone) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return 'submit';
          }
        }
      }, ]
    });
    myPopup.then(function(res) {
      //  alert($scope.newDate.date);
      console.log(res);
      var barber_name = barberInfo.getBarber();
      remoteGabinosAptDB.get($scope.data.date.toISOString() + '-' + barber_name).then(function(doc) {
        // handle doc
      }).catch(function(err) {
        console.log(err);
        if (err.status === 404) {
          remoteGabinosAptDB.put({
            _id: $scope.data.date.toISOString() + '-' + barber_name,
            date: $scope.data.date,
            time_slots: [{
              slot_num: $scope.data.slot_num,
              client_name: $scope.data.name,
              client_phone: $scope.data.phone,
              barber: barber_name,
              time: $scope.data.date,
              alarm: $scope.data.alarm,
              sms_0: false,
              sms_1: false,
              done: false
            }]
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

    });
  };

  $scope.delete = function(id) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Are you sure you want to cancel?',
      //  template: 'Are you sure you want to cancel this appointment?',
      buttons: [{
        text: 'Cancel',
        type: 'button-stable'
      }, {
        text: '<b>Yes</b>',
        type: 'button-assertive',
        onTap: function(e) {
          return true;
        }
      }, ]
    });
    confirmPopup.then(function(res) {
      console.log(res);
      if (res) {
        console.log('about to delete');
        remoteAptDB.get(id).then(function(doc) {
          return remoteAptDB.remove(doc);
        }).then(function(result) {
          // handle result
          console.log('Deleted Document!');
        }).catch(function(err) {
          console.log(err);
        });
      } else {
        //canceled
        console.log('canceled!');
      }
    });
  };

  // $scope.reschedule = function(apt) {
  //   console.log('reschedule!');
  //   $scope.data = {};
  //   // An elaborate, custom popup
  //  var myPopup = $ionicPopup.show({
  //    template: '<input type="datetime-local" ng-model="newDate.date">',
  //    title: 'Choose new date and time.',
  //    scope: $scope,
  //    buttons: [
  //      { text: 'Cancel',
  //      onTap: function(e) {
  //          return 'cancel button';
  //        }
  //     },
  //      {
  //        text: '<b>Confirm</b>',
  //        type: 'button-assertive',
  //        onTap: function(e) {
  //         //  alert($scope.newDate.date);
  //          if (!$scope.newDate.date) {
  //            //don't allow the user to close unless he enters wifi password
  //            e.preventDefault();
  //          } else {
  //            return 'submit';
  //          }
  //        }
  //      },
  //    ]
  //  });
  //  myPopup.then(function(res) {
  //   //  alert($scope.newDate.date);
  //    console.log(res);
  //    if (res === 'submit'){
  //      remoteAptDB.put({
  //        _id: apt._id,
  //        _rev: apt._rev,
  //        client_name: apt.client_name,
  //        client_phone: apt.client_phone,
  //        barber: apt.barber,
  //        time: $scope.newDate.date,
  //        alarm: apt.alarm,
  //        sms_0:  apt.sms_0,
  //        sms_1: apt.sms_1,
  //        done: apt.done
  //      }).then(function(response) {
  //      // handle response
  //      console.log('Reschedule Successful');
  //    }).catch(function (err) {
  //      console.log(err);
  //    });
  //  }
  //  });
  // };

  // Flex Calendar Shit -------------------------------------------------------

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth(); //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  $scope.options = {
    // defaultDate: new Date(yyyy, mm, dd),
    minDate: new Date(2015, 06, 12),
    maxDate: new Date(2015, 12, 31),
    disabledDates: [
      new Date(2015, 07, 24),
      new Date(2015, 07, 25),
      new Date(2015, 07, 26),
    ],
    dayNamesLength: 3, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true, //set monday as first day of week. Default is false
    eventClick: function(date_obj) {
      console.log(date_obj);
      $scope.data.date = date_obj.date || $scope.options.defaultDate;
      $scope.appointments = appointmentData.getApts(date_obj.date);
      // console.log($scope.appointments);
    },
    dateClick: function(date_obj) {
      console.log(date_obj);
      $scope.data.date = date_obj.date || $scope.options.defaultDate;
      $scope.appointments = appointmentData.getApts(date_obj.date);
    },
    changeMonth: function(month, year) {
      console.log(month, year);
    },
  };

  $scope.events = [{
    foo: 'bar',
    date: new Date(2015, 7, 10)
  }, {
    foo: 'bar',
    date: new Date(2015, 7, 11)
  }];

  //Event Listeners
  $scope.$on('addGabinosApt', function(event, apt) {
    console.log('Updating');
    for (var i = 0; i < appointments.length; i++) {
      // if (appointments[i]._id === apt._id) {
      //   appointments.splice(i, 1);
      // }
      if (appointments[i].date === $scope.data.date) {
        appointments[i].push(apt);
      }
    }
    appointments.push(apt);
    // console.log("appts:");
    // console.log(appointments);
    // console.log($scope.appointments);
  });

  $scope.$on('deleteGabinosApt', function(event, id) {
    console.log('Deleting');
    for (var i = 0; i < appointments.length; i++) {
      if (appointments[i]._id === id) {
        appointments.splice(i, 1);
      }
    }
  });

  var barber_name = barberInfo.getBarber();
  remoteGabinosAptDB.get(new Date().toISOString() + '-' + barber_name).then(function(doc) {
    // handle doc
  }).catch(function(err) {
    console.log(err);
    console.log(err.status);
  });

});

app.controller("ScheduleCtrl", function($scope, $rootScope, $state, $ionicPopup, aptListener, $ionicSideMenuDelegate, barberInfo) {

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
    remoteAptDB.put({
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
