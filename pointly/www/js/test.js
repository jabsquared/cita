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
      templateUrl: 'templates/schedule.html'
    })
    .state('form', {
      url: '/form',
      templateUrl: 'templates/app-form.html',
      controller: 'FormCtrl'
    });

  $urlRouterProvider.otherwise('/sign-in');

})

.controller('SignInCtrl', function($http, $scope, $state) {
  console.log('Enter SingInCtrl');

  // $http.get('https://api-us.clusterpoint.com/100600/Appointly/_list_last.json').success(function(response) {
  //   console.log('Start Route!');
  //   angular.forEach(documents.children, function(child) {
  //     // $scope.stories.push(child.data);
  //     console.log(child.name);
  //   })
  //   }).error(function(response) {
  //   console.log('fuck.');
  //   // body...
  // });

  $scope.signIn = function(user) {
    console.log('Sign-In', user);
    $state.go('schedule');
  };

})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
})

.controller('FormCtrl', function($scope) {
  $scope.go = function() {
    $.ajax({
      url: 'https://api-us.clusterpoint.com//100600/Appointly/_insert/2',
      type: 'POST',
      dataType: 'json',
      data: '{"id":"2","name":"Multicare","img_p":"multicare.png","date":"July 25th","time":"4","zone":"pm"}',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('bpshonyak@live.com:Password01'));
      },
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

    $.ajax({
      url: 'http://appointlysmsserver.mybluemix.net/data',
      type: 'POST',
      dataType: 'json',
      data: '{"txt":"Test! I works! Yeaaaaa! I love life!"}',
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

  $scope.stories = [];

  $scope.appointments = info;

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
