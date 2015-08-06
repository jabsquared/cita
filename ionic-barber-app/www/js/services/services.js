app.factory('aptListener', function($rootScope) {

  localAptDB.changes({
    continuous: true,
    onChange: function(change) {
      if (!change.deleted) {
        $rootScope.$apply(function() {
          //55555555555555555555555555555555
          localAptDB.get(change.id, function(err, doc) {
            $rootScope.$apply(function() {
              if (err) console.log(err);
                $rootScope.$broadcast('add', doc);
            })
          });
          //55555555555555555555555555555555
        })
      } else {
        $rootScope.$apply(function() {
          $rootScope.$broadcast('delete', change.id);
        });
      }
    }
  });
  return true;
});
