app.controller("OAuthCtrl", function($scope, $state, Auth, UserData) {
  console.log('in oauth controller');
  $scope.data = {};

  $scope.fbLogin = function() {
    Auth.$authWithOAuthPopup("facebook", {
      scope: "email" // permissions requested
    }).then(function(authData) {
      // Login Successful
    }).catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup("facebook").then(function(authData) {
          console.log(authData);
        });
      } else {
        // Another error occurred
        console.log(error);
      }
    });
  };

  $scope.login = function() {
    console.log('logging in!');
    console.log('email: ' + $scope.data.email);
    console.log('password ' + $scope.data.password);
    Auth.$authWithPassword({
      email: $scope.data.email,
      password: $scope.data.password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  };

  $scope.signup = function() {
    $state.go('signup');
  };

  Auth.$onAuth(function(authData) {
    if (authData === null) {
      console.log("Not logged in yet");
    } else {
      console.log("Logged in as", authData.uid);
      // Save Profile Information
      if (authData.provider === 'facebook') {
        UserData.setUser({
          uid: authData.uid,
          full_name: authData.facebook.displayName,
          email: authData.facebook.email,
          profile_img: authData.facebook.profileImageURL
        });
      } else if (authData.provider === 'password') {
        UserData.setUser({
          uid: authData.uid,
          full_name: '',
          email: authData.password.email,
          profile_img: authData.password.profileImageURL
        });
      }
      $state.go('account');
    }
    $scope.authData = authData; // This will display the user's name in our view
  });
});
