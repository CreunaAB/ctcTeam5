var sp = getSpotifyApi(1),
  models = sp.require('sp://import/scripts/api/models'),
  views = sp.require('sp://import/scripts/api/views'),
  search = new models.Search('Rain'),
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



      // Listen to the eventlisteners indicating change of tab
      search.localResults = models.LOCALSEARCHRESULTS.APPEND;
      search.searchAlbums = false;
      var multiple_tracks_playlist = new models.Playlist();

          //for(var i=0;i<20;i++) {
              //var library_track = models.Track.fromURI(library_tracks[i].data.uri);
              //multiple_tracks_playlist.add(library_track);
          //}
      search.observe(models.EVENT.CHANGE, function() {
        search.tracks.forEach(function(track) {
          console.log(track);
          multiple_tracks_playlist.add(track.uri);
        });
      });

      console.log(multiple_tracks_playlist);

      var multiple_tracks_player = new views.List(multiple_tracks_playlist);
          multiple_tracks_player.track = null; // Don't play the track right away
          multiple_tracks_player.context = multiple_tracks_playlist;
         
          /* Pass the player HTML code to #multiple-tracks-player */
          var multiple_tracks_player_HTML = document.getElementById('multiple-tracks-player');
          console.log(multiple_tracks_player_HTML);
          multiple_tracks_player_HTML.appendChild(multiple_tracks_player.node);

      search.appendNext();
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

