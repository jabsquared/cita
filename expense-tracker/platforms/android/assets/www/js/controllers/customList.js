(function() {
  'use strict';

  angular
    .module('app')
    .controller('MyCtrl', ListCtrl);

  function ListCtrl($scope) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true
  }
})();
