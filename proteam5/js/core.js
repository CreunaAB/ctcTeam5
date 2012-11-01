var sp = getSpotifyApi(1),
  models = sp.require('sp://import/scripts/api/models'),
  views = sp.require('sp://import/scripts/api/views'),
  search = new models.Search('Rain'),
  player = models.player,
  view;

view = {
  init : function() {

      $('a').click(function(e){
        e.preventDefault();
        view.getSongsAndIconForLocation($(this).attr("id"));
      });

      $('button').click(view.getCity);
  },  

  getCity : function (e) {
      e.preventDefault();
      var city = $('input').attr('value');

      console.log(city)
      var geocoder = new google.maps.Geocoder();

      if (geocoder) {
          geocoder.geocode({ 'address': city }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  view.searchByLatLong(location);
              }
              else {
                  console.log("Geocoding failed: " + status);
              }
          });
      }
  },
  searchByLatLong: function(location){
      var lng = location.Ya;
      var lat = location.Za;

      $.ajax({
          url: 'http://api.yr.no/weatherapi/locationforecast/1.8/',
          method: 'GET',
          data: {'lat': lat, 'lon': lng},
          dataType: 'xml',
          success: view.onSuccess,
          error: view.onFailure
      });
  },
  doSearch : function() {
      // Listen to the eventlisteners indicating change of tab
      search.localResults = models.LOCALSEARCHRESULTS.APPEND;
      search.searchAlbums = false;
      var multiple_tracks_playlist = new models.Playlist();

      search.observe(models.EVENT.CHANGE, function() {
        search.tracks.forEach(function(track) {

          multiple_tracks_playlist.add(track.uri);
        });
      });

      console.log(multiple_tracks_playlist);

      var multiple_tracks_player = new views.List(multiple_tracks_playlist);

      multiple_tracks_player.context = multiple_tracks_playlist;

      console.log(multiple_tracks_playlist.data.uri);

      models.player.play(multiple_tracks_playlist.data.uri);

      var $playlist = $('#play-list');

      $playlist.html('');
      $playlist.append(multiple_tracks_player.node);

      //important dont remove!!
      search.appendNext();
  },

  onSuccess : function (data) {
    var firstActualTime = $(data).find("time")[1],
        symbol = $(firstActualTime).find("symbol").attr("id");

    search = new models.Search(view.getSearchWordForSymbol(symbol)); 
    view.doSearch();
    view.getSymbolImg(view.getSymbolId(symbol));
  },

  onFailure : function(data) {
      console.log(data, "fejl");
  },

  getSymbolImg : function (symbol) {
    var url = 'http://api.met.no/weatherapi/weathericon/1.0/?symbol=' + symbol + ';content_type=image/png',
      img = '<img id="icon" src="' + url + '" alt="bild" />';

    if (!$('#icon').length) {
      $('h1').after(img);
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
    }
  },

  getSearchWordForSymbol : function (symbol) {
    switch(symbol)  {
      case "SUN": {
        return "Sun";
        break;
      }
      case "LIGHTCLOUD": {
        return "Sun";
        break;
      }
      case "PARTLYCLOUD": {
        return "Cloud";
        break;
      }
      case "CLOUD": {
        return "Cloud";
        break;
      }
      case "LIGHTRAINSUN": {
        return "Sun";
        break;
      }
      case "LIGHTRAINTHUNDERSUN": {
        return "Thunder";
        break;
      }
      case "SLEETSUN": {
        return "Sun";
        break;
      }
      case "SNOWSUN": {
        return "Snow";
        break;
      }
      case "LIGHTRAIN": {
        return "Rain";
        break;
      }
      case "RAIN": {
        return "Rain";
        break;
      }
      case "RAINTHUNDER": {
        return "Thunder";
        break;
      }
      case "SLEET": {
        return "Rain";
        break;
      }
      case "SNOW": {
        return "Snow";
        break;
      }
      case "SNOWTHUNDER": {
        return "Thunder";
        break;
      }
      case "FOG": {
        return "Fog";
        break;
      }
      case "LIGHTCLOUD": {
        return "Cloud";
        break;
      }
      case "LIGHTRAINSUN": {
        return "Sun";
        break;
      }
      case "SNOWSUN": {
        return "Snow";
        break;
      }
      case "SLEETSUNTHUNDER": {
        return "Thunder";
        break;
      }
      case "SNOWSUNTHUNDER": {
        return "Thunder";
        break;
      }
      case "LIGHTRAINTHUNDER": {
        return "Thunder";
        break;
      }
      case "SLEETTHUNDER": {
        return "Thunder";
        break;
      }
      default: {
        return 1;
        break;
      }
    }
  }
};


exports.init = view.init();

