//global variables
var cityList = [];
var cityname;

//global mainly used to make connection to api one weather
var currentCity = $("#searched-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var UVindex = $("#uv-index");

//global variables mainly with weather display
var weatherContent = $("#weather-container");

//access to the OpenWeather API
var APIkey = "116ba6c8059f9b9fbbd135332921be2e";

// show date
var currentDate = moment().format('L');
$("#todaysDate").text("(" + currentDate + ")");

//jquery to color date
//$(todaysDate").css("color", "#e1aa7d");

//city entered
var showCity = function() {
    $("#cityList").empty();
    $("#cityInput").val("");

    //loop to add city to history list
    for (i=0; i < cityList.length; i++) {
        //test out jquery to add elements to hold searched cities 
        var searchedCity = $("<a>");
        searchedCity.addClass("list-group-item list-group-item-action list-group-item-primary city");
        searchedCity.attr("data-name", cityList[i]);
        searchedCity.text(cityList[i]);
        
        $("#cityList").prepend(searchedCity);
        
    }
    //use jquery to change the background color of the item populated
    $("a").css("background-color", "#6a2e35");
}

//pull city list fromlocal storage
var pullCityList = function() {
    var fromLocalStorage = JSON.parse(localStorage.getItem("cities"));

    if (fromLocalStorage !== null) {
        cityList = fromLocalStorage;
    }

    //call showCity
    showCity();
}

//pulls city into local storage and reloads
var showWeather = function() {
    var storedCity = JSON.parse(localStorage.getItem("currentCity"));

    if (storedCity !== null) {
        cityname = storedCity;

        displayWeather();
        displayFiveDayForecast();
    }
}

//function to save city (maybe as an array) into local storage
var storeCityArray = function() {
    localStorage.setItem("cities", JSON.stringify(cityList));
}

//function to save current display into local storage
var storeCurrentCity = function() {
    localStorage.setItem("currentCity", JSON.stringify(cityname));
}

//click event for city search button
$("#citySearch").on("click", function(event) {
    event.preventDefault();

    cityname = $("#cityInput").val().trim();
    if (cityname === "") {

    } else if (cityList.length >= 5) {
        cityList.shift();
        cityList.push(cityname);

    } else {
        cityList.push(cityname);
    }

    //call functions
    storeCurrentCity();
    storeCityArray();
    showCity();
    showWeather();
    //getFiveDay();
});

//function to run api aja call and display current city, weather and  dont forget uv index
var showWeather = function() {
    //url for ajax api call
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=" + APIkey;

    //ajax call/
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        console.log(response);

        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='todaysDate'>");
        $("#todaysDate").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
        currentTemp.text(response.main.temp);
        currentTemp.append("&deg;F");
        currentHumidity.text(response.main.humidity + "%");
        currentWindSpeed.text(response.wind.speed + "MPH");

        //get UV index
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var UVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
        
        $.ajax({
           url: UVurl,
           method: "GET"
            }).then(function (response) {
           var Uvindex = parseInt(response.value);
           var Uvspan = $(".uvSpot");

           Uvspan.text("UV index: " + response.value);

           if (Uvindex > 0 && Uvindex <= 2.99) {
               Uvspan.addClass("low");
           } 
            else if (Uvindex >= 3 && Uvindex <= 5.99) {
               Uvspan.addClass("moderate");
           } 
            else {
               Uvspan.addClass("high");
           }
    });

    //5 day forecast and display
    // var countryCode = response.sys.country;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + APIkey + "&lat=" + lat +  "&lon=" + lon;

    var fiveCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-m'>");
    var fiveCard = $("<div class='card'>");
    var fiveCardBody = $("<div class='card-body'>");
    var fiveDate = $("<h5 class='card-title'>");
    var fiveIcons = $("<img>");
    var fiveTemp = $("p class='card-text mb-0'>");
    var fiveHumidity = $("p< class='card-text mb-0'>");

    $.ajax({
        url: forecastURL,
        method: "GET"
    }) .then(function(response) {
        console.log(response);
        $('#fiveDayForecast').empty();
        
        //for loop
        for (var i = 1; i < response.list.length; i+=8) {
            var forecastData = moment(response.list[i].dt_text).format("L");
            console.log(forecastData);

            //build card 
            $('#fiveDayForecast').append(fiveCol);
            fiveCol.append(fiveCard);
            fiveCard.append(fiveCardBody);

            //add sections to card for 5 day forecast
            fiveCardBody.append(fiveDate);
            fiveCardBody.append(fiveIcons);
            fiveCardBody.append(fiveTemp);
            fiveCardBody.append(fiveHumidity);

            fiveIcons.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
            fiveIcons.attr("alt", response.list[i].weather[0].main)
            fiveDate.text(forecastData);
            fiveTemp.text(response.list[i].main.temp);
            fiveTemp.prepend("Temp: ");
            fiveTemp.append("$deg;F");
            fiveHumidity.text(response.list[i].main.humidity);
            fiveHumidity.prepend("Humidity: ");
            fiveHumidity.append("%");

            console.log(response.list[i].dt_txt);
            console.log(response.list[i].main.temp);
            console.log(response.list[i].main.humidity);
        }
        });
});
}

//function to call the 5 fday and display
// var getFiveDay = function () 



// funtion to make history list

//check if enter key hit instead of click
$("#cityInput").keypress(function(event) {
    if (event.which === 13) {
        $("#citySearch").click();
    }
})

// local storage functions
// pullCityList();
// showWeather();


