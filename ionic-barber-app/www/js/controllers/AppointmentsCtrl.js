app.controller("AppointmentsCtrl", function($scope, $state, $ionicPopup, $rootScope, barberInfo) {
  localAptDB.sync(remoteAptDB, { live:true, retry: true });

  //Feilds
  $scope.data = {};
  $scope.data.alarm = true;
  $scope.data.date = new moment();

  $scope.barber = barberInfo.getBarber();
  $scope.appointments = [];
  $scope.events = [];
  // Change this into DB.getall Appointment
  // $scope.events = [{
  //   date: moment()
  // }, {
  //   date: new Date(2015, 7, 16)
  // }];
  // $scope.events = $scope.appointments;

  //Create index for DB once
  localAptDB.createIndex({
    index: {
      fields: ['date', 'barber']
    }
  });

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
        k = moment(k, "YYYY-MM-DDTh:mm a");

        console.log('putting data');
        console.log(res.start_time);
        localAptDB.put({
          _id: k.format() + '-' + apm.slot_num + '-' + $scope.barber + '-' + $scope.data.phone,
          slot_num: apm.slot_num,
          client_name: $scope.data.name,
          client_phone: $scope.data.phone,
          barber: $scope.barber,
          date: k.format('YYYY-MM-DD'),
          start_time: apm.start_time,
          end_time: apm.end_time,
          alarm: $scope.data.alarm,
          sms_0: false,
          sms_1: false,
          done: false
        }).then(function(response) {
          // RELOAD Appointment
          process(k);
        }).catch(function(err) {
          console.log(err);
        });
      }
    });
  };

  $scope.delete = function(apm) {
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
          return 'submit';
        }
      }]
    });
    confirmPopup.then(function(res) {
      console.log(res);
      if (res === 'submit') {
        console.log('Deleting');
        var i = $scope.data.date.format('YYYY-MM-DDT');
        var j = apm.start_time;

        var k = i + j;
        k = moment(k, "YYYY-MM-DDTh:mm a");

        console.log('about to delete');
        localAptDB.remove(apm).then(function(){
          process(k);
        });
      } else {
        //canceled
        console.log('Failed to Delete!');
      }
    });
  };

  // Flex Calendar-------------------------------------------------------

  var populate = function Populate(date) {
    console.log('called populate');
    console.log($scope.data.date);
    var today = $scope.data.date.hour(9).minutes(0);
    for (var i = 0; i < 14; i++) {
      $scope.appointments[i] = {
        slot_num: i,
        date: today.format('YYYY-MM-DD'),
        start_time: today.add((45 * i), 'minutes').format('h:mm a'),
        end_time: today.add(45, 'minutes').format('h:mm a')
      };
      today.subtract((45 * i) + 45, 'minutes');
    }
    console.log('Scope Appointments:');
    console.log($scope.appointments);
  };

  var process = function Process(date) {
    // console.log('call process');
    populate(date);
    // console.log(moment(date).format('YYYY-MM-DD'));
    // console.log($scope.barber);
    var searchDate = moment(date).format("YYYY-MM-DD");
    // console.log('searchDate: ' + searchDate);
    localAptDB.find({
      selector: {
        date: searchDate.toString(),
        barber: $scope.barber
      }
    }).then(function(res) {
      // yo, a result
      console.log(res);
      for (var i = 0; i < res.docs.length; i++) {
        $scope.appointments[res.docs[i].slot_num] = res.docs[i];

      }
      console.log("Events: ");
      console.log($scope.events);
      $scope.$apply();
    }).catch(function(err) {
      // ouch, an error
      console.log('Find Error:');
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
      // $scope.data.date = moment(date_obj);
      // process(date_obj);
    },
    dateClick: function(date_obj) {
      // TODO Remove call to process.
      $scope.data.date = moment(date_obj);
      process(date_obj);
      $state.reload();
    },
    changeMonth: function(month, year) {
      console.log(month, year);
      // $scope.data.date.year = year;
      // $scope.data.date.month = month;
      // process($scope.data.date);
    },
  };

});
