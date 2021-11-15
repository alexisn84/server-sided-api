//global variables
var cityList = [];
var cityname;

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
    //displayWeather();
    //displayFiveDayForecast();
});


//event handler for "enter" instead of click

//function to run api aja call and display current city, weather and 5 day forecaset to the dom, dont forget uv index


//function to call the 5 fday and display

// funtion to make history list

// local storage functions
// pullCityList();
// showWeather();


