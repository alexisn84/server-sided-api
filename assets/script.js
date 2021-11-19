//global variables
var cityList = [];

//global mainly used to make connection to api one weather
var currentCity = $("#searched-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var UVindex = $("#uv-index");
var fiveDayContainer = $("#fiveDayForecast")

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

    //try to change color when over over city list *failure nothng worked 6 codes tried*
    // document.getElementById("cityList").style.hover.color='#b6d094';
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
var storedWeather = function() {
    var storedCity = JSON.parse(localStorage.getItem("currentCity"));

    if (storedCity !== null) {
        cityname = storedCity;

        showWeather();
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
        currentCity.append("<small id='todaysDate'>");
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

    //5 day forecast and display
    // var countryCode = response.sys.country;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=116ba6c8059f9b9fbbd135332921be2e";
    
    $.ajax({
        url: forecastURL,
        method: "GET"
    }) .then((response) => {
        console.log("this is data from url request: ", response.list);
        $('#fiveDayForecast').empty();
        
        //for loop
        for (var i = 1; i < response.list.length; i+=8) {
            response.list[i]
            console.log (response.list[i]);
            //var forecastData = moment(response.list[i].dt_txt).format("L");
            //console.log(response.list[i].dt_txt)
            //console.log(forecastData);

            var fiveCol = document.createElement("div");
            fiveCol.setAttribute("class", "col-12 col-md-6 col-lg forecast-day mb-m");
            

            var fiveCard = document.createElement("div");
            fiveCard.setAttribute("class", "card");
            fiveCol.append(fiveCard);

            var fiveCardBody = document.createElement("div");
            fiveCardBody.setAttribute("class", "card-body");
            fiveCardBody.style.color = "#e1aa7d";
            fiveCardBody.style.backgroundColor = "#6a2e35";
            fiveCard.append(fiveCardBody);

            //get date
            var fiveDate = document.createElement("h5");
            fiveDate.setAttribute("class", "card-title");
            fiveDate.textContent = moment(`${response.list[i].dt_txt}`).format("L"); 
            // fiveDate.style.color = "#6a2e35";
            // fiveDate.style.backgroundColor = "#e1aa7d";
            fiveCardBody.append(fiveDate);

            //get icon
            var fiveIcons =document.createElement("img");
            fiveIcons.setAttribute("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
            fiveIcons.setAttribute("alt", response.list[i].weather[0].main);
            fiveCardBody.append(fiveIcons);

            //get temp
            var fiveTemp = document.createElement("p");
            fiveTemp.setAttribute("class", "card-text mb-0");
            fiveTemp.textContent = `Temp: ${response.list[i].main.temp} F`;
            fiveCardBody.append(fiveTemp);

            //get humidity
            var fiveHumidity = document.createElement("p");
            fiveHumidity.setAttribute("class", "card-text mb-0");
            fiveHumidity.textContent = `Humidity: ${response.list[i].main.humidity}%`;
            fiveCardBody.append(fiveHumidity);

            //get wind speed
            var fiveWind = document.createElement("p");
            fiveWind.setAttribute("class", "card-text mb-0");
            fiveWind.textContent = `Wind Speed: ${response.list[i].wind.speed} mph`;
            fiveCardBody.append(fiveWind);
            
            fiveDayContainer.append(fiveCol);
        }
        });
    });
    //console.log(forecastURL);
});
}

// funtion to make history list
var searchHistory = function() {
    cityname = $(this).attr("data-name");
    showWeather();
}

//check if enter key hit instead of click
$("#cityInput").keypress(function(event) {
    if (event.which === 13) {
        $("#citySearch").click();
    }
})

//click searched city to re-show weather current and 5 day forecast
$(document).on("click", ".city", searchHistory);
