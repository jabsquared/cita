app.controller("AppointmentsCtrl", function($scope, $state, $ionicPopup, $rootScope, barberInfo, appointmentData) {

  // Initailize Appointments
  // Feilds
  $scope.data = {};
  $scope.data.date = new moment();
  var apts = process($scope.data.date);
  $scope.appointments = apts;

  // Old Feilds
  $scope.barber = barberInfo.getBarber();

  localAptDB.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change', function(change) {
    // handle change
    if (change === 'deleted') {
      //Handle Deleted Doc
      docChange('delete', change.doc);
    } else {
      // Handle Created Doc
      docChange('create', change.doc);
    }
  }).on('complete', function(info) {
    // changes() was canceled
  }).on('error', function(err) {
    console.log(err);
  });

  $scope.eqTime = function(atime) {
    return atime === $scope.data.date;
  };

  //Functions
  $scope.back = function() {
    $state.go('account');
  };

  $scope.schedule = function(num) {
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
      if (res === 'submit') {
        localAptDB.put({
          _id: moment().format() + '-' + $scope.barber,
          slot_num: num,
          client_name: $scope.data.name,
          client_phone: $scope.data.phone,
          barber: $scope.barber,
          date: $scope.data.date,
          alarm: $scope.data.alarm,
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
      }
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

  // Process results and return completed appointments array***
  function process(date_obj) {
    console.log('in process');
    localAptDB.allDocs({
      include_docs: true,
      attachments: true,
      startkey: date_obj.format('YYYY-MM-DD'),
      endkey: barberInfo.getBarber()
    }).then(function(res) {
      console.log('res: ' + res.rows);
      var appointments = [];
      for (var i = 0; i < 14; i++) {
        if (res.rows[i] !== null) {
          appointments[i] = res.rows[i];
        } else {
          appointments[i] = {
            slot_num: i
          };
        }
      }
      return appointments;
    }).catch(function(err) {
      console.log(err);
      return null;
    });
  }

  // Modify $scope.appointments based on changes to DB ***
  function docChange(type, doc) {
    if (type === 'delete') {
      // Handle Deleting Doc
      for (var i = 0; i < $scope.appointments.length; i++) {
        if ($scope.appointments[i]._id === doc._id) {
          $scope.appointments[i] = {
            slot_num: i
          };
        }
      }
    } else if (type === 'create') {
      // Handle Adding Doc
      for (var x = 0; x < $scope.appointments.length; x++) {
        if ($scope.appointments[x]._id === doc._id) {
          $scope.appointments[x] = doc;
        }
      }
    }
  }

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
    // minDate: new Date(2015, 06, 12),
    // maxDate: new Date(2015, 12, 31),
    disabledDates: [
      new Date(2015, 07, 24),
      new Date(2015, 07, 25),
      new Date(2015, 07, 26),
    ],
    dayNamesLength: 3, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true, //set monday as first day of week. Default is false
    eventClick: function(date_obj) {
      console.log(date_obj);
      apts = process(new moment(date_obj));
    },
    dateClick: function(date_obj) {
      apts = process(new moment(date_obj));
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

});
