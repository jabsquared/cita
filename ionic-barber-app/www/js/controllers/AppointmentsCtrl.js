app.controller("AppointmentsCtrl", function($scope, $state, $ionicPopup, $rootScope, barberInfo, appointmentData) {

  $scope.data = {};
  $scope.data.date = new moment();
  $scope.data.alarm = true;

  $scope.barber = barberInfo.getBarber();
  $scope.appointments = [];
  $scope.events = [];

  $scope.eqTime = function(atime) {
    return atime === $scope.data.date;
  };

  //Functions
  $scope.back = function() {
    $state.go('account');
  };

  $scope.schedule = function(apm) {
    // An elaborate, custom popup
    // console.log(apm.start_time);
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/schedule.html',
      title: apm.start_time,
      scope: $scope,
      buttons: [{
        text: 'Cancel',
        onTap: function(e) {
          return 'canceled';
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
            return apm;
          }
        }
      }, ]
    });

    myPopup.then(function(res) {
      //  alert($scope.newDate.date);
      // console.log(res);
      if (res !== 'canceled') {

        var i = $scope.data.date.format('YYYY-MM-DDT');
        var j = apm.start_time;

        var k = i + j;
        k = moment(k,"YYYY-MM-DDTh:mm a");

        console.log('putting data'); console.log(res.start_time);
        localAptDB.put({
          _id: k.format() + '-' + apm.slot_num + '-' + barberInfo.getBarber(),
          slot_num: apm.slot_num,
          client_name: $scope.data.name,
          client_phone: $scope.data.phone,
          barber: $scope.barber,
          date: k.format(),
          alarm: $scope.data.alarm,
          sms_0: false,
          sms_1: false,
          done: false
        }).then(function(response) {
          // console.log('Complete!');
          // Show some pops up fancy stuffs here, also go back to login.
          // console.log(response);
          // TODO: RELOAD Appointment

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
      // template: 'Are you sure you want to cancel this appointment?',
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

  localAptDB.changes({
    live: true
  }).on('change', function(change) {
    // var nao = moment().format().substring(0, 13);
    // localAptDB.allDocs({
    //   include_docs: true,
    //   startkey: nao, //YMD
    //   endkey: barberInfo.getBarber()
    // }, function(err, response) {
    //   if (err) {
    //     return console.log(err);
    //   }
    //   // appointments = response.rows;
    //   $rootScope.$apply(); // <--- better call this!
    // });
  }).on('create', function(change) {
    console.log("Appointments:");
    console.log(change);
  }).on('delete', function(change) {

  });
  // Flex Calendar-------------------------------------------------------


  var populate = function Populate(date) {
    console.log('acll populate');
    // body...
    // console.log(date);
    $scope.data.date = moment(date);

    var today = $scope.data.date.hours(9);
    for (var i = 0; i < 14; i++) {
      $scope.appointments[i] = {
        slot_num: i,
        date: today.format('YYYY-MM-DD'),
        start_time: today.add((45 * i), 'minutes').format('h:mm a'),
        end_time: today.add(45, 'minutes').format('h:mm a')
      };
      today.subtract((45 * i) + 45, 'minutes');
    }
  };

  // Process results and return completed appointments array***
  var process = function Process(date) {
    console.log('call process');
    populate(date);
    console.log(moment(date).format('YYYY-MM-DD'));
    console.log(barberInfo.getBarber());
    localAptDB.allDocs({
      include_docs: true,
      startkey: moment(date).format('YYYY-MM-DD'),
      endkey: barberInfo.getBarber()
    }).then(function(result) {
      console.log('Result: rows');
      console.log(result.rows);
      // $scope.events = result.rows;
      for (var i = 0; i < result.rows.length; i++) {
        console.log('Results:');
        console.log(result.rows[i].doc);
        $scope.appointments[result.rows[i].doc.slot_num] = result.rows[i].doc;
        console.log('Scope Apts');
        // console.log($scope.appointments[result.rows[i].doc.slot_num]);
        console.log($scope.appointments);
      }
      $scope.$apply();
    }).catch(function(err) {
      console.log(err);
    });
  };

  // 1st Population Loop for 1st time user.
  process(moment().format('YYYY-MM-DD'));

  $scope.options = {
    // defaultDate: new Date(yyyy, mm, dd),
    // minDate: new Date(2015, 06, 12),
    // maxDate: new Date(2015, 12, 31),
    dayNamesLength: 3, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true, //set monday as first day of week. Default is false
    eventClick: function(date_obj) {
      // Process data
      process(date_obj);
      // Re-populate with Appointment
    },
    dateClick: function(date_obj) {
      // apts = process(new moment(date_obj));
      // Populate with Blank field
      // populate(date_obj);
      process(date_obj);
    },
    changeMonth: function(month, year) {
      console.log(month, year);
    },
  };

  // Change this into DB.getall Appointment
  // $scope.events = [{
  //   date: moment()
  // }, {
  //   date: new Date(2015, 7, 16)
  // }];
  // $scope.events = $scope.appointments;
});
