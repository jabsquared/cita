var appointments = [];

app.controller("AppointmentsCtrl", function($scope, $state, $ionicPopup, $rootScope, aptListener, barberInfo, appointmentData, gabinoAptListener) {

  // Initailize Appointments
  // Feilds
  $scope.appointments = appointments = appointmentData.getApts();
  $scope.barber = barberInfo.getBarber();
  $scope.schedule_info = {};
  $scope.schedule_info.alarm = true;
  $scope.today = new moment();
  $scope.data = {};
  $scope.data.date = moment().format('YYYY-MM-DD');

  $scope.eqTime = function (atime) {
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
        remoteGabinosAptDB.put({
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

  //Event Listeners
  $scope.$on('addGabinosApt', function(event, apt) {
    console.log(apt);
    console.log('Updating');
    for (var i = 0; i < apt.rows.length; i++) {
      // console.log('Loop Date:');
      console.log(apt.rows[i].doc.date);
      // if (new moment(apt.rows[i].doc.date).format('YYYY-MM-DD') === $scope.data.date.format('YYYY-MM-DD')) {
        appointments[apt.rows[i].doc.slot_num].client_name = apt.rows[i].doc.client_name;
        appointments[apt.rows[i].doc.slot_num].client_phone = apt.rows[i].doc.client_phone;
        appointments[apt.rows[i].doc.slot_num].barber = apt.rows[i].doc.barber;
        appointments[apt.rows[i].doc.slot_num].date = new moment (apt.rows[i].doc.date).format('YYYY-MM-DD');
        appointments[apt.rows[i].doc.slot_num].alarm = apt.rows[i].doc.alarm;
        appointments[apt.rows[i].doc.slot_num].sms_0 = apt.rows[i].doc.sms_0;
        appointments[apt.rows[i].doc.slot_num].sms_1 = apt.rows[i].doc.sms_1;
        appointments[apt.rows[i].doc.slot_num].done = apt.rows[i].doc.done;
      // }
    }
    console.log(appointments);
  });

  $scope.$on('deleteGabinosApt', function(event, id) {
    console.log('Deleting');
    for (var i = 0; i < appointments.length; i++) {
      if (appointments[i]._id === id) {
        appointments.splice(i, 1);
      }
    }
  });

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
      $scope.data.date = new moment(date_obj.date).format('YYYY-MM-DD');
      $scope.appointments = appointmentData.getApts(date_obj.date);
      // console.log($scope.appointments);
    },
    dateClick: function(date_obj) {
      console.log(date_obj);
      $scope.data.date = new moment(date_obj.date).format('YYYY-MM-DD');
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

});
