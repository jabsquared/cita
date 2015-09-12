app.controller('SignupCtrl', function($scope, $state) {
  $scope.data = {};

  $scope.signup = function() {
    if (
      $scope.data.password != null && $scope.data.password.length > 7 &&
      $scope.data.password === $scope.data.confirm &&
      $scope.data.email != null &&
      $scope.data.email.length > 5
    ) {
      // Create a new User
      var ref = new Firebase("https://beau-barbershop.firebaseio.com");
      ref.createUser({
        email: $scope.data.email,
        password: $scope.data.password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          $state.go('oauth');
        }
      });
    } else {
      console.log('incorrect credentials');
    }
  };

  $scope.cancel = function() {
    $state.go('oauth');
  };

});
