var APIKey = "23698a8b82c09505e9e6c16024c08515";

var searchFormEl = document.querySelector('#search-form');
var pastSearches = document.querySelector('#past-search');
var cityInput = document.querySelector('#city-input');
var weatherContentEl = document.querySelector('#weather-content');
var fiveDayEl = document.querySelector('#five-day');
var fiveDayTitleEl = document.querySelector('#five-title');

// runs the api function based on the city input of user
function searchCity(event) {
    event.preventDefault();

    var searchInput = document.querySelector('#city-input').value;

    apiOne(searchInput);
};

// runs CurrentWeather api to get primary data
function apiOne(searchInput) {
    var currentWeatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey;

    fetch(currentWeatherApi)
        .then(function (response) {
            if(!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            apiTwo(data);
        })
        .catch(function (error) {
            console.error(error);
        })

    // uses data from first api to run OneCall api for secondary data
    function apiTwo(coordinates) {
        console.log(coordinates);
        var cityTitle = document.querySelector('#city-title');
        var cityDate = moment().format("M/D/YYYY");
        cityTitle.textContent = coordinates.name + " (" + cityDate + ")";

        var lati = coordinates.coord.lat
        var longi = coordinates.coord.lon
        
        var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lati + "&lon=" + longi + "&units=imperial&appid=" + APIKey;

        fetch(oneCallApi)
        .then(function (response) {
            if(!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            printResults(data);
        })
        .catch(function (error) {
            console.error(error);
        })
    }
};

// prints data for current weather on the webpage
function printResults(dataResults) {
    console.log(dataResults);

    var infoOne = document.getElementById('city-temp');
    infoOne.textContent = 'Temp: ' + dataResults.current.temp + ' °F';

    var infoTwo = document.getElementById('city-wind');
    infoTwo.textContent = 'Wind: ' + dataResults.current.wind_speed + ' MPH';

    var infoThree = document.getElementById('city-humid');
    infoThree.textContent = 'Humidity: ' + dataResults.current.humidity + ' %';

    var infoFour = document.getElementById('city-uv');
    infoFour.textContent = 'UV Index: ';

    var infoFive = document.getElementById('uv-index');
    infoFive.textContent = dataResults.current.uvi

    // changes color of UV index
    if (dataResults.current.uvi < 3) {
        infoFive.style.backgroundColor = '#00FF00';
    } else if (dataResults.current.uvi < 6) {
        infoFive.style.backgroundColor = '#FFFF00';
    } else if (dataResults.current.uvi >= 7) {
        infoFive.style.backgroundColor = '#FFA500';
    };

    // displays icon of current weather
    var cityImage = document.getElementById('city-image');
    var iconCode = dataResults.current.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    cityImage.setAttribute("src", iconURL);

    fiveDayTitleEl.textContent = "5-Day Forecast:"

    // for loop used to print data for the five day forecast
    for (var i = 1; i < 6; i++) {
        var cardDate = document.getElementById("cardDate"+[i]);
        cardDate.textContent = moment().day([i+5]).format("M/D/YYYY");

        var cardTemp = document.getElementById("cardTemp"+[i]);
        cardTemp.textContent = 'Temp: ' + dataResults.daily[i].temp.day + ' °F';

        var cardWind = document.getElementById("cardWind"+[i]);
        cardWind.textContent = 'Wind: ' + dataResults.daily[i].wind_speed + ' MPH';

        var cardHumid = document.getElementById("cardHumid"+[i]);
        cardHumid.textContent = 'Humidity: ' + dataResults.daily[i].humidity + ' %';
    }

    // displays icon of upcoming weather for each respective day of the forecast
    var cardImage1 = document.getElementById("cardImage1");
    var iconCode1 = dataResults.daily[1].weather[0].icon;
    var iconURL1 = "http://openweathermap.org/img/wn/" + iconCode1 + "@2x.png";
    cardImage1.setAttribute("src", iconURL1);

    var cardImage2 = document.getElementById("cardImage2");
    var iconCode2 = dataResults.daily[2].weather[0].icon;
    var iconURL2 = "http://openweathermap.org/img/wn/" + iconCode2 + "@2x.png";
    cardImage2.setAttribute("src", iconURL2);

    var cardImage3 = document.getElementById("cardImage3");
    var iconCode3 = dataResults.daily[3].weather[0].icon;
    var iconURL3 = "http://openweathermap.org/img/wn/" + iconCode3 + "@2x.png";
    cardImage3.setAttribute("src", iconURL3);

    var cardImage4 = document.getElementById("cardImage4");
    var iconCode4 = dataResults.daily[4].weather[0].icon;
    var iconURL4 = "http://openweathermap.org/img/wn/" + iconCode4 + "@2x.png";
    cardImage4.setAttribute("src", iconURL4);

    var cardImage5 = document.getElementById("cardImage5");
    var iconCode5 = dataResults.daily[5].weather[0].icon;
    var iconURL5 = "http://openweathermap.org/img/wn/" + iconCode5 + "@2x.png";
    cardImage5.setAttribute("src", iconURL5);
}

searchFormEl.addEventListener('submit', searchCity);

var cities = [];

// functions used to store input of form as an array into local storage and display buttons for each city input
function renderCities() {
    pastSearches.innerHTML = "";

    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var button = document.createElement('button');
        button.textContent = city;
        button.setAttribute("class", "col-12 btn-lg btn-secondary");
        button.setAttribute("data-index", i);

        pastSearches.appendChild(button);
    }
}

function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !==null) {
        cities = storedCities;
    }

    renderCities();
}

function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

searchFormEl.addEventListener("submit", function(event) {
    event.preventDefault();

    var cityText = cityInput.value.toLowerCase().trim();

    if (cityText === "") {
        return;
    }

    // prevents multiple instances of the same city in local storage
    if (cities.includes(cityText) === false) {
        cities.push(cityText);
    } else {
        cities.push(cityText);
        cities.pop();
    }

    cityInput.value = "";

    storeCities();
    renderCities();
})

init();

// function to run the primary function once city button from local storage is clicked
pastSearches.addEventListener("click", function(event) {
    var element = event.target;

    if (element.matches("button") === true) {    
        var storedName = element.textContent;
        console.log(storedName);
        apiOne(storedName)
    }
})