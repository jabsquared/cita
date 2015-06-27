(function() {
  'use strict';

  angular
    .module('app')
    .controller('history', History);

  function History($scope, $ionicListDelegate, $ionicActionSheet, ExpenseSvc) {
    $scope.expenses = ExpenseSvc.getExpensesWithCategory();
  }



})();
