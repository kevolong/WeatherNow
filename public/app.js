var latitude = 0;
var longitude = 0;
var tempC = 0;
var tempF = 0;
var windSpeedMiles = 0;
var windSpeedMeters = 0;
var windDir = "N/A";
var visMiles = "N/A";
var visKilometers = "N/A";
var timeOfDay = "";
var currentWeather = {};

//Get geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      displayWeather();
    });
  } else {
    $("#loading-message").html("Enable location data or else I can't help you!");
  }
}

//Get API data and display weather - imperial by default
function displayWeather() {
  $.ajax({
    type: "GET",
    dataType: "json",
    cache: false,
    //url: "https://fcc-weather-api.glitch.me/api/current?lat=48.856&lon=2.352",
    //url: "https://fcc-weather-api.glitch.me/api/current?lat=29.8&lon=-98.6",
    url: "https://fcc-weather-api.glitch.me/api/current?lat=" + latitude + "&lon=" + longitude,
    success: function(result) {
      currentWeather = result;

      //Hide loading message
      $("#loading-jumbo").css("display", "none");

      //Check time of day
      if (currentWeather.dt >= currentWeather.sys.sunrise && currentWeather.dt <= currentWeather.sys.sunset) {
        timeOfDay = "day";
      } else {
        timeOfDay = "night";
      }

      //Set background image based on weather
      setBackground();

      //Make hidden stuff visible
      $("#weather-jumbo")
        .css("display", "block")
        .addClass("animated fadeIn");
      $(".btn").css("visibility", "visible");
      $("#bottom-details").css("visibility", "visible");

      //Location
      $("#city").html(currentWeather.name + ", " + currentWeather.sys.country);

      //Icon
      if (timeOfDay == "day") {
        $("#weather-icon").attr("class", "wi " + "wi-owm-day-" + currentWeather.weather[0].id);
      } else {
        $("#weather-icon").attr("class", "wi " + "wi-owm-night-" + currentWeather.weather[0].id);
      }

      //Temperature
      tempC = round(currentWeather.main.temp, 1);
      tempF = Math.round(currentWeather.main.temp * 1.8 + 32);
      $("#temp").html(tempF);
      $("#degree-scale").attr("class", "wi wi-fahrenheit degree");

      // Description
      $("#description").html(currentWeather.weather[0].description);

      //Wind
      windSpeedMiles = Math.round(currentWeather.wind.speed * 2.24);
      windSpeedMeters = Math.round(currentWeather.wind.speed);
      //Make sure wind has direction data
      if (currentWeather.wind.hasOwnProperty("deg")) {
        windDir = windDirection(currentWeather.wind.deg);
        $("#wind-dir-icon").attr(
          "class",
          "wi wi-wind wi-towards-" + windDir.toLowerCase().replace("/", "") + " detail-icons"
        );
      }
      $("#wind-speed").html(windSpeedMiles + " mph");
      $("#wind-dir").html(windDir);

      //Humidity
      $("#humidity").html(currentWeather.main.humidity);

      //Visibility
      //Make sure has visibility data
      if (currentWeather.hasOwnProperty("visibility")) {
        visMiles = String(Math.round(currentWeather.visibility / 1000 / 1.609344)) + " mi";
        visKilometers = String(Math.round(currentWeather.visibility / 1000)) + " km";
      }
      $("#visibility").html(visMiles);
    }
  });
}

//Set background image based on weather data id
function setBackground() {
  var id = currentWeather.weather[0].id;
  //var id = 781;
  var image = "";

  if (id >= 801 && id <= 803) {
    // Some Clouds
    if (timeOfDay == "day") {
      image = "public/assets/broken-clouds_day.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.87)");
    } else {
      image = "public/assets/broken-clouds_night.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.87)");
    }
  } else if (id == 804) {
    // Overcast Clouds
    if (timeOfDay == "day") {
      image = "public/assets/clouds_day.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.6)");
    } else {
      image = "public/assets/clouds_night.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.85)");
    }
  } else if (id >= 200 && id <= 232) {
    // Thunderstorm
    if (timeOfDay == "day") {
      image = "public/assets/thunderstorm_day.jpg";
    } else {
      image = "public/assets/thunderstorm_night.jpg";
    }
  } else if (id == 800) {
    // Clear Sky
    if (timeOfDay == "day") {
      image = "public/assets/clear-sky_day.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.5)");
    } else {
      image = "public/assets/clear-sky_night.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.7)");
    }
  } else if (id >= 500 && id <= 531) {
    // Rain
    if (timeOfDay == "day") {
      image = "public/assets/rain_day.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.87)");
    } else {
      image = "public/assets/rain_night.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.87)");
    }
  } else if (id >= 300 && id <= 321) {
    // Drizzle
    if (timeOfDay == "day") {
      image = "public/assets/drizzle_day.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.87)");
    } else {
      image = "public/assets/drizzle_night.jpg";
    }
  } else if (id >= 600 && id <= 622) {
    // Snow
    if (timeOfDay == "day") {
      image = "public/assets/snow_day.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.7)");
    } else {
      image = "public/assets/snow_night.jpg";
    }
  } else if (id == 701 || id == 721 || id == 741) {
    // mist fog haze
    if (timeOfDay == "day") {
      image = "public/assets/fog_day.jpg";
    } else {
      image = "public/assets/fog_night.jpg";
    }
  } else if (id == 711) {
    // Smoke
    if (timeOfDay == "day") {
      image = "public/assets/smoke_day.jpg";
    } else {
      image = "public/assets/smoke_night.jpg";
    }
  } else if (id == 731 || id == 751 || id == 761) {
    // Sand and Dust
    if (timeOfDay == "day") {
      image = "public/assets/dust_day.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.5)");
    } else {
      image = "public/assets/dust_night.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.87)");
    }
  } else if (id == 762) {
    // Volcanic ash
    if (timeOfDay == "day") {
      image = "public/assets/ash_day.jpg";
    } else {
      image = "public/assets/ash_night.jpg";
    }
  } else if (id == 771) {
    // Squall
    if (timeOfDay == "day") {
      image = "public/assets/squall_day.jpg";
    } else {
      image = "public/assets/squall_night.jpg";
    }
  } else if (id == 781) {
    // Tornado
    if (timeOfDay == "day") {
      image = "public/assets/tornado_day.jpg";
      $(".jumbotron").css("background-color", "rgba(255,255,255,.7)");
    } else {
      image = "public/assets/tornado_night.jpg";
    }
  }
  $("body")
    .css("background-image", "url('" + image + "')")
    .animate(
      {
        opacity: 1
      },
      1000
    );
}

//Convert wind degrees to directions
function windDirection(degrees) {
  var directions = {
    1: { direction: "N", values: { min: 348, max: 360 } },
    2: { direction: "N", values: { min: 0, max: 11 } },
    3: { direction: "N/NE", values: { min: 11, max: 33 } },
    4: { direction: "NE", values: { min: 33, max: 56 } },
    5: { direction: "E/NE", values: { min: 56, max: 78 } },
    6: { direction: "E", values: { min: 78, max: 101 } },
    7: { direction: "E/SE", values: { min: 101, max: 123 } },
    8: { direction: "SE", values: { min: 123, max: 146 } },
    9: { direction: "S/SE", values: { min: 146, max: 168 } },
    10: { direction: "S", values: { min: 168, max: 191 } },
    11: { direction: "S/SW", values: { min: 191, max: 213 } },
    12: { direction: "SW", values: { min: 213, max: 236 } },
    13: { direction: "W/SW", values: { min: 236, max: 258 } },
    14: { direction: "W", values: { min: 258, max: 281 } },
    15: { direction: "W/NW", values: { min: 281, max: 303 } },
    16: { direction: "NW", values: { min: 303, max: 326 } },
    17: { direction: "N/NW", values: { min: 326, max: 348 } }
  };
  for (var i = 1; i < 18; i++) {
    if (degrees >= directions[i].values.min && degrees <= directions[i].values.max) {
      return directions[i].direction;
    }
  }
}

//Update dispaly units to metric
function goMetric() {
  //Enable/disable buttons
  $("#metric")
    .addClass("active")
    .prop("disabled", true);
  $("#imperial")
    .removeClass("active")
    .prop("disabled", false);
  //Animate changes
  $("#top-details").addClass("animated zoomIn");
  $("#bottom-details").addClass("animated zoomIn");
  //Update units
  $("#temp").html(tempC);
  $("#degree-scale").attr("class", "wi wi-celsius degree");
  $("#wind-speed").html(windSpeedMeters + " m/s");
  $("#visibility").html(visKilometers);
  //Remove animation class
  setTimeout(function() {
    $("#bottom-details").removeClass("animated zoomIn");
    $("#top-details").removeClass("animated zoomIn");
  }, 1000);
}

//Update dispaly units to imperial
function goImperial() {
  //Enable/disable buttons
  $("#imperial")
    .addClass("active")
    .prop("disabled", true);
  $("#metric")
    .removeClass("active")
    .prop("disabled", false);
  //Animate the changes
  $("#bottom-details").addClass("animated zoomIn");
  $("#top-details").addClass("animated zoomIn");
  //Update units
  $("#temp").html(tempF);
  $("#degree-scale").attr("class", "wi wi-fahrenheit degree");
  $("#wind-speed").html(windSpeedMiles + " mph");
  $("#visibility").html(visMiles);
  //Remove animation class
  setTimeout(function() {
    $("#bottom-details").removeClass("animated zoomIn");
    $("#top-details").removeClass("animated zoomIn");
  }, 1000);
}

//Precise rounding that doesn't fuck up floating point
function round(number, precision) {
  var shift = function(number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }
    var numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? +numArray[1] + precision : precision));
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
}

$(document).ready(function() {
  getLocation();
  $("#metric").on("click", goMetric);
  $("#imperial").on("click", goImperial);
});
