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

      search.observe(models.EVENT.CHANGE, function() {
        search.tracks.forEach(function(track) {
//          console.log(track);
          multiple_tracks_playlist.add(track.uri);
        });
      });

      console.log(multiple_tracks_playlist);

      var multiple_tracks_player = new views.List(multiple_tracks_playlist);
//      multiple_tracks_player.track = null; // Don't play the track right away
      multiple_tracks_player.context = multiple_tracks_playlist;

      console.log(multiple_tracks_playlist.data.uri);

      models.player.play(multiple_tracks_playlist.data.uri);

      var $playlist = $('#play-list'),
          play_list_href = '<a href="' + multiple_tracks_playlist.uri + ' ">Play</a>';

      $playlist.append(multiple_tracks_player.node);
//      $playlist.prepend(play_list_href);

      //important dont remove!!
      search.appendNext();


      $('a').click(function(e){
        e.preventDefault();
        view.getSongsAndIconForLocation($(this).attr("id"));
      });
  },  

  getSongsAndIconForLocation : function(location) {
     switch(location)  {
      case "stockholm": {
        $.ajax({
          url: 'http://api.yr.no/weatherapi/locationforecast/1.8/?lat=59.33;lon=18.07',
          dataType: 'xml',
          success: view.onSuccess,
          error: view.onFailure
        });
        break;
      }
      case "puertorico": {
       $.ajax({
          url: 'http://api.yr.no/weatherapi/locationforecast/1.8/?lat=18.2613;lon=66.4360',
          dataType: 'xml',
          success: view.onSuccess,
          error: view.onFailure
        });
        break;
      }
      case "sydney": {
       $.ajax({
          url: 'http://api.yr.no/weatherapi/locationforecast/1.8/?lat=33.8683;lon=151.2086',
          dataType: 'xml',
          success: view.onSuccess,
          error: view.onFailure
        });
        break;
      }
      default : {
        $.ajax({
          url: 'http://api.yr.no/weatherapi/locationforecast/1.8/?lat=59.33;lon=18.07',
          dataType: 'xml',
          success: view.onSuccess,
          error: view.onFailure
        });
      }
    }
  },

  onSuccess : function (data) {
    var firstActualTime = $(data).find("time")[1],
        symbol = $(firstActualTime).find("symbol").attr("id");


    view.getSymbolImg(view.getSymbolId(symbol));
  },

  onFailure : function(data) {
      console.log(data, "fejl");
  },

  getSymbolImg : function (symbol) {
    var url = 'http://api.met.no/weatherapi/weathericon/1.0/?symbol=' + symbol + ';content_type=image/png',
      img = '<img id="icon" src="' + url + '" alt="bild" />';

    if (!$('#icon').length) {
      $('body').append(img);
    } else {
      $('#icon').attr('src', url);
    }
  },

  getSymbolId : function (symbol) {
    switch(symbol)  {
      case "SUN": {
        return 1;
        break;
      }
      case "LIGHTCLOUD": {
        return 2;
        break;
      }
      case "PARTLYCLOUD": {
        return 3;
        break;
      }
      case "CLOUD": {
        return 4;
        break;
      }
      case "LIGHTRAINSUN": {
        return 5;
        break;
      }
      case "LIGHTRAINTHUNDERSUN": {
        return 6;
        break;
      }
      case "SLEETSUN": {
        return 7;
        break;
      }
      case "SNOWSUN": {
        return 8;
        break;
      }
      case "LIGHTRAIN": {
        return 9;
        break;
      }
      case "RAIN": {
        return 10;
        break;
      }
      case "RAINTHUNDER": {
        return 11;
        break;
      }
      case "SLEET": {
        return 12;
        break;
      }
      case "SNOW": {
        return 13;
        break;
      }
      case "SNOWTHUNDER": {
        return 14;
        break;
      }
      case "FOG": {
        return 15;
        break;
      }
      case "LIGHTCLOUD": {
        return 16;
        break;
      }
      case "LIGHTRAINSUN": {
        return 17;
        break;
      }
      case "SNOWSUN": {
        return 18;
        break;
      }
      case "SLEETSUNTHUNDER": {
        return 19;
        break;
      }
      case "SNOWSUNTHUNDER": {
        return 20;
        break;
      }
      case "LIGHTRAINTHUNDER": {
        return 21;
        break;
      }
      case "SLEETTHUNDER": {
        return 22;
        break;
      }
      default: {
        return 1;
        break;
      }
    };
  }
}





exports.init = view.init();

