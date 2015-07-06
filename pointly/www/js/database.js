//console.log("called database script!");

var info;

//console.log("Ended database script!");
setInterval(function() {
  if (userid != null) {
    var doc = $.ajax({
      url: 'https://api-us.clusterpoint.com//100600/Appointly/_list_last',
      type: 'GET',
      dataType: 'json',
      // data      : '{"query": "<name>Test</name>"}',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('bpshonyak@live.com:Password01'));
      },
      success: function(data) {
        if (typeof success != 'undefined') {
          // jQuery.parseJSON(doc.responseJSON.documents.toSource());
          success(data);
        }
      },
      fail: function(data) {
        alert(data.error);
        console.log('Fail!');
        if (typeof fail != 'undefined') {
          fail(data);
        }
      }
    });

    doc.done(function(data) {
      info = $.grep(data.documents, function(n, i) {
        return n.user_id === userid;
      });
    });
  }
}, 999);
