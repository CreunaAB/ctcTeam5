var sp = getSpotifyApi(1),
    models = sp.require('sp://import/scripts/api/models'),
    views = sp.require('sp://import/scripts/api/views'),
    search = new models.Search('Rain'),
    player = models.player,
    view;

view = {
  city : '',

  init : function() {
      $('a').click(function(e){
        e.preventDefault();

        view.getSongsAndIconForLocation($(this).attr("id"));
      });

      $('button').click(view.getCity);
  },  

  /**
  * Get city from input
  */
  getCity : function (e) {
      e.preventDefault();
      var city = $('input').attr('value'),
          geocoder = new google.maps.Geocoder();

      if (geocoder) {
          geocoder.geocode({ 'address': city }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  view.city = results[0].formatted_address;
                  view.searchByLatLong(results[0].geometry.location);
              }
              else {
                  console.log("Geocoding failed: " + status);
              }
          });
      }
  },

  /**
  * Get weather from YR.no by using the coordinates for the city
  */
  searchByLatLong: function(location){
      // These 'ab' & '$a' tend to change?! A week ago they were named Zy & Za, wtf!
      var lng = location.ab,
          lat = location.$a;

      $.ajax({
          url: 'http://api.yr.no/weatherapi/locationforecast/1.8/',
          method: 'GET',
          data: {'lat': lat, 'lon': lng},
          dataType: 'xml',
          success: view.onSuccess,
          error: view.onFailure
      });
  },

  /**
  * Do Spotify search 
  */
  doSearch : function() {
      search.localResults = models.LOCALSEARCHRESULTS.APPEND;
      search.searchAlbums = false;

      var multiple_tracks_playlist = new models.Playlist();

      search.observe(models.EVENT.CHANGE, function() {
        var tracks = view.randomizeSearch(search.tracks);
        
        tracks.forEach(function(track) {
          multiple_tracks_playlist.add(track.uri);
        });
      });

      var multiple_tracks_player = new views.List(multiple_tracks_playlist);
      multiple_tracks_player.context = multiple_tracks_playlist;

      models.player.play(multiple_tracks_playlist.data.uri);

      //important dont remove!!
      search.appendNext();
  },

  /**
  * Randomize playlist
  */
  randomizeSearch: function(results){
      var i = results.length;

      if (i == 0) {
        return false;
      }

      while (--i) {
          var j = Math.floor( Math.random() * ( i + 1 ) ),
              tempi = results[i],
              tempj = results[j];

          results[i] = tempj;
          results[j] = tempi;
      }
      return results;
  },

  onSuccess : function (data) {
    var firstActualTime = $(data).find("time")[1],
        symbol = $(firstActualTime).find("symbol").attr("id");

    searchWord = view.getSearchWordForSymbol(symbol);
    search = new models.Search("title:" + searchWord.term);

    view.doSearch();
    view.getSymbolImg(view.getSymbolId(symbol));
    view.printCopy(String(searchWord.copy));
  },

  onFailure : function(data) {
      console.log('City cordinates failed, reason:', data);
  },

  getSymbolImg : function (symbol) {
    var url = 'http://api.met.no/weatherapi/weathericon/1.0/?symbol=' + symbol + ';content_type=image/png',
        img = '<img id="icon" src="' + url + '" alt="bild" />',
        pup = $('.pup'),
        icon = $('#icon');

      icon.remove();
      pup.addClass('poop');
      $('.dog').prepend(img);

      window.setTimeout(function() {
        pup.removeClass('poop');
          $('#icon').animate({
              'bottom' : '150px'
            }, 'slow', function () {            
             $('#icon').animate({
                'right' : '270px',
                'width' : '100px'
             }, 'slow', function () {
              $('#icon').animate({
                  'bottom' : '100px'
               }, 'slow');
             });
            });
      }, 200);
  },

  printCopy : function(copy){
    $('.bubble').html(view.formatString(copy, view.city));    
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

  formatString : function() {
      var s = arguments[0];
      for (var i = 0; i < arguments.length - 1; i++) {       
        var reg = new RegExp("\\{" + i + "\\}", "gm");             
        s = s.replace(reg, '<strong>' + arguments[i + 1] + '</strong>');
      }

      return s;
  },

  getSearchWordForSymbol : function (symbol) {
    switch(symbol)  {
      case "SUN": {
        return {"term": "Sun", "copy": "Woof, sunny {0}, here\'s a lovely melody just for you!"};
        break;
      }
      case "LIGHTCLOUD": {
        return {"term": "Beach", "copy": "Things are looking up for you {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "PARTLYCLOUD": {
        return {"term": "Sunny", "copy": "The sun is kind of shining {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "CLOUD": {
          return {"term": "Cloud", "copy": "Feeling kind of cloudy, {0}? Here\'s a lovely melody just for you!"};
        break;
      }
      case "LIGHTRAINSUN": {
          return {"term": "Rainbow", "copy": "Could be a rainbow out there, {0}! Go find a pot of gold! Here\'s a tune for your search!"};
        break;
      }
      case "LIGHTRAINTHUNDERSUN": {
          return {"term": "Bipolar", "copy": "Kind of crazy out there, eh {0}? Here\'s a lovely melody just for you!"};
        break;
      }
      case "SLEETSUN": {
          return {"term": "Cold", "copy": "Whoooo it's really cold out there, {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "SNOWSUN": {
          return {"term": "Snow", "copy": "Lovely snow, {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "LIGHTRAIN": {
          return {"term": "Rain", "copy": "Don\'t freak out, it's just a few raindrops {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "RAIN": {
          return {"term": "Rain", "copy": "Singin' in the rain, {0}! here\'s a lovely melody just for you!"};
        break;
      }
      case "RAINTHUNDER": {
          return {"term": "Storm", "copy": "It's ugly out there, {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "SLEET": {
          return {"term": "Sleet", "copy": "What the hell with this weather, {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "SNOW": {
          return {"term": "Snow", "copy": "Boy, it's cold out, {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "SNOWTHUNDER": {
          return {"term": "Thundersnow", "copy": "Seriously snowing out there, {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "FOG": {
          return {"term": "Fog", "copy": "It's hard to see out there, {0}! Watch out for the Ripper? Here\'s a lovely melody just for you!"};
        break;
      }
      case "SLEETSUNTHUNDER": {
          return {"term": "Depression", "copy": "{0}, I'll be honest with you, this weather sucks. Here\'s a lovely melody just for you!"};
        break;
      }
      case "LIGHTRAINTHUNDER": {
          return {"term": "Gloom", "copy": "This weather totally sucks, {0}! Here\'s a lovely melody just for you!"};
        break;
      }
      case "SLEETTHUNDER": {
          return {"term": "thunder", "copy": "Cover your ears, {0}! here\'s a lovely melody just for you!"};
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

