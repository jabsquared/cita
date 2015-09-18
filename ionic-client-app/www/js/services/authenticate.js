app.factory('Auth', function($firebaseAuth) {
  var ref = new Firebase('https://beau-barbershop.firebaseio.com');
  return $firebaseAuth(ref);
});

// REVIEW : NEED TO went through a renaming session...

app.service('UserData', function() {
  var user = {
    uid: '',
    fullName: '',
    email: '',
    profileImg: '',
  };

  return {
    getUser: function() {
      return user;
    },
    setUser: function(data) {
      user.uid = data.uid;
      user.full_name = data.full_name;
      user.email = data.email;
      user.profile_img = data.profile_img;
    },
    clearUser: function() {
      user.uid = '';
      user.full_name = '';
      user.email = '';
      user.profile_img = '';
    }
  };
});
