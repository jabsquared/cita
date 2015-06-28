console.log("called database script!");

var doc;

console.log("Ended database script!");
setInterval(function(){
  doc = $.ajax({
    url       : 'https://api-us.clusterpoint.com//100600/Appointly/_list_last',
    type      : 'GET',
    dataType  : 'json',
    // data      : '{"query": "<name>Test</name>"}',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa('bpshonyak@live.com:Password01'));
    },
    success   : function (data) {
      if (typeof success != 'undefined') {
        success(data);
        console.log(data);

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
},10000);
