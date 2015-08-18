var app = angular.module('starter', ['ionic','ionic.service.core',  'flexcalendar', 'pascalprecht.translate']);
// 'ionic.service.analytics',

//instanciate databases
var localAptDB = new PouchDB("appointments");

var remoteAptDB = new PouchDB('https://itchentleverturearywhers:U7vFQNN2joOhU03Mw0iUx3SN @af48ada6-78db-4210-a80d-86619c82407e-bluemix.cloudant.com/appointments', {
  auth: {
    username: 'itchentleverturearywhers',
    password: 'U7vFQNN2joOhU03Mw0iUx3SN'
  }
});

// $ionicAnalytics
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // $ionicAnalytics.register();
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    // localAptDB.sync(remoteAptDB, {
    //   live: true,
    //   retry: true
    // });
  });
});

app.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

  $stateProvider

  .state('account', {
    url: '/account',
    templateUrl: 'templates/account.html',
    controller: 'AccountCtrl'
  })

  .state('appointments', {
    url: '/appointments',
    templateUrl: 'templates/appointments.html',
    controller: 'AppointmentsCtrl'
  })

  .state('schedule', {
    url: '/schedule',
    templateUrl: 'templates/schedule.html',
    controller: 'ScheduleCtrl'
  });

  $urlRouterProvider.otherwise('/account');

  // Flex Calendar Language Options

  $translateProvider.translations('en', {
    JANUARY: 'January',
    FEBRUARY: 'February',
    MARCH: 'March',
    APRIL: 'April',
    MAI: 'Mai',
    JUNE: 'June',
    JULY: 'July',
    AUGUST: 'August',
    SEPTEMBER: 'September',
    OCTOBER: 'October',
    NOVEMBER: 'November',
    DECEMBER: 'December',

    SUNDAY: 'Sunday',
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thurday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday'
  });
  $translateProvider.translations('span', {
    JANUARY: 'Enero',
    FEBRUARY: 'Febrero',
    MARCH: 'Marzo',
    APRIL: 'Abril',
    MAI: 'Mayo',
    JUNE: 'Junio',
    JULY: 'Julio',
    AUGUST: 'Agosto',
    SEPTEMBER: 'Septiembre',
    OCTOBER: 'Octubre',
    NOVEMBER: 'Noviembre',
    DECEMBER: 'Diciembre',

    SUNDAY: 'domingo',
    MONDAY: 'lunes',
    TUESDAY: 'martes',
    WEDNESDAY: 'miércoles',
    THURSDAY: 'jueves',
    FRIDAY: 'viernes',
    SATURDAY: 'sábado'
  });
  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy('escape');

});
