var sp = getSpotifyApi(1),
  models = sp.require('sp://import/scripts/api/models'),
  player = models.player,
  view;

view = {
  init : function() {
      $.ajax({
        url: 'http://api.yr.no/weatherapi/locationforecast/1.8/?lat=59.33;lon=18.07',
        dataType: 'xml',
        success: view.onSuccess,
        error: view.onFailure
      });
  },  

  onSuccess : function (data) {
    var firstActualTime = $(data).find("time")[1];
    var symbol = $(firstActualTime).find("symbol").attr("id");
      console.log(firstActualTime, symbol, "success");
  },

  onFailure : function(data) {
      console.log(data, "fejl");
  }
}





exports.init = view.init();
