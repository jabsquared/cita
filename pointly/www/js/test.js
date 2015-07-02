angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('schedule', {
      url: '/schedule',
      templateUrl: 'templates/schedule.html',
      controller: 'ScheduleCtrl'
    })
    .state('form', {
      url: '/form',
      templateUrl: 'templates/app-form.html',
      controller: 'FormCtrl'
    });

  $urlRouterProvider.otherwise('/sign-in');

})

.controller('ScheduleCtrl', function($scope, $http){
  $scope.stories = [];
  $scope.appointments = info;
  $scope.doRefresh = function() {
    $http.get('/schedules')
     .success(function(/*newItems*/) {
      //  $scope.items = newItems;
      $scope.appointments = info;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
    };
})

.controller('SignInCtrl', function($http, $scope, $state, $ionicPopup) {


  $scope.showAlert = function(title, body) {
   var alertPopup = $ionicPopup.alert({
     title: title,
     template: body
   });
   alertPopup.then(function(res) {
     console.log('Error');
   });
 };

  console.log('Enter SingInCtrl');
  $scope.url = '#';
  $scope.acc_number = '';
  $scope.acc_password = '';
  $scope.login = function (number, password){
    console.log('Enter login function');
    console.log('number: ' + number);
    console.log('password: ' + password);
    var users = $.ajax({
      url       : 'https://api-us.clusterpoint.com/100600/User_Accounts/_list_last',
      type      : 'GET',
      dataType  : 'json',
      // data      : '{"query": "<name>Test</name>"}',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('bpshonyak@live.com:Password01'));
      },
      success   : function (data) {
        console.log('Retrived Users!');
        if (typeof success != 'undefined') {
          // jQuery.parseJSON(doc.responseJSON.documents.toSource();
          success(data);
        }

      },
      fail      : function (data) {
        alert(data.error);
        console.log('Fail!');
        if (typeof fail != 'undefined') {
          fail(data);
        }
      }
    });

    users.done (function (data) {
      var d = data.documents;
      //----------------------------------------------------------
      console.log(d);
      var result = $.grep(d, function(e){ return e.id == number && e.password == password; });
      console.log(result);
      if (result.length == 0) {
        $scope.showAlert('Error', 'Incorrect Number or Password!');
      } else if (result.length == 1) {
        $state.go('schedule');
      } else {
        $scope.showAlert('Error', 'Duplicate Users Found!');
      }
    });

  }

  // $scope.signIn = function(user) {
  //   console.log('Sign-In', user);
  //   $state.go('schedule');
  // };

})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
})

.controller('FormCtrl', function($http, $scope, $state, $timeout, $ionicPopup) {

    $scope.app_id;
    $scope.app_name;
    $scope.app_img_p='multicare.png';
    $scope.app_date = new Date();
    $scope.app_time = new Date();

  $scope.go = function(app_id, app_date, app_name, app_time) {
    console.log('Passed into function:');
    console.log(app_id);
    console.log(app_date);
    console.log(app_name);
    console.log(app_time);
    // app_date = app_date.toString();
    // app_time = app_time.toString();
    // var fullTime = app_time.split(" ");
    // app_time = fullTime[0];
    // var app_zone = fullTime[1];
    // app_date(new Date(), "mmmm dS, yyyy");

    // console.log('Fulltime: ');
    // console.log(fullTime);
    // console.log('Time: ');
    // console.log(app_time);
    // console.log('Zone: ');
    // console.log(app_zone);

    var send = {
      "id"    : app_id,
      "name"  : app_name,
      "img_p" : $scope.app_img_p,
      "date"  : $scope.app_date,
      "time"  : $scope.app_time,
      "zone"  : 'PM'
    }

    console.log(send);

    $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'All done!',
       template: 'Appointment Requested'
     });
     alertPopup.then(function(res) {
       $state.go('schedule');
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };


    $.ajax({
      //removed the /2 from url.
      url: 'https://api-us.clusterpoint.com//100600/Appointly/_insert',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(send),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('bpshonyak@live.com:Password01'));
      },
      success: function(data) {
        if (typeof success != 'undefined') {
          // jQuery.parseJSON(doc.responseJSON.documents.toSource());


          success(data);
        }
        $scope.showAlert();

      },
      fail: function(data) {
        alert('No!');
        alert(data.error);
        console.log('Fail!');
        if (typeof fail != 'undefined') {
          fail(data);
        }
      }
    })


    $.ajax({
      url: 'http://appointlysmsserver.mybluemix.net/data',
      type: 'POST',
      contentType: "text/plain; charset=utf-8",
      dataType: 'text',
      data: send.name + " scheduled an appoinment with you at " + send.time + send.zone + " on " + send.date + ", location: The Church",
      // beforeSend: function(xhr) {
      //   xhr.setRequestHeader('Authorization', 'Basic ' + btoa('bpshonyak@live.com:Password01'));
      // },
      success: function(data) {
        alert("Submitted!");
        if (typeof success != 'undefined') {
          // jQuery.parseJSON(doc.responseJSON.documents.toSource());
          success(data);
        }
      },
      fail: function(data) {
        alert('No!');
        alert(data.error);
        console.log('Fail!');
        if (typeof fail != 'undefined') {
          fail(data);
        }
      }
    })

  }

})
.controller('MainCtrl', function($http, $scope) {
  $scope.test = 'Scope Works!';

  // $scope.stories = [];
  //
  // $scope.appointments = info;

  // [{
  //   name: 'Green Valley Clinic',
  //   img_p: 'health.png',
  //   date: 'June 30th',
  //   time: 10,
  //   zone: 'am'
  // }, {
  //   name: 'Silver Point Dental',
  //   img_p: 'dental.png',
  //   date: 'July 16th',
  //   time: 2,
  //   zone: 'pm'
  // }, {
  //   name: 'Multicare',
  //   img_p: 'multicare.png',
  //   date: 'July 25th',
  //   time: 4,
  //   zone: 'pm'
  // }];

});
