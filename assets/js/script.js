var APIKey = "23698a8b82c09505e9e6c16024c08515";

var searchFormEl = document.querySelector('#search-form');
var weatherContentEl = document.querySelector('#weather-content');
var fiveDayEl = document.querySelector('#five-day');
var fiveDayTitleEl = document.querySelector('#five-title');

function searchCity(event) {
    event.preventDefault();

    var searchInput = document.querySelector('#city-input').value;

    apiOne(searchInput);
};

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

function printResults(dataResults) {
    console.log(dataResults);

    var infoOne = document.getElementById('city-temp');
    infoOne.textContent = 'Temp: ' + dataResults.current.temp + '°F';

    var infoTwo = document.getElementById('city-wind');
    infoTwo.textContent = 'Wind: ' + dataResults.current.wind_speed + 'MPH';

    var infoThree = document.getElementById('city-humid');
    infoThree.textContent = 'Humidity: ' + dataResults.current.humidity + '%';

    var infoFour = document.getElementById('city-uv');
    infoFour.textContent = 'UV Index: ';

    var infoFive = document.getElementById('uv-index');
    infoFive.textContent = dataResults.current.uvi

    if (dataResults.current.uvi < 3) {
        infoFive.style.backgroundColor = '#00FF00';
    } else if (dataResults.current.uvi < 6) {
        infoFive.style.backgroundColor = '#FFFF00';
    } else if (dataResults.current.uvi >= 7) {
        infoFive.style.backgroundColor = '#FFA500';
    };

    fiveDayTitleEl.textContent = "5-Day Forecast:"

    for (var i = 1; i < 6; i++) {
        var cardDate = document.getElementById("cardDate"+[i]);
        cardDate.textContent = moment().day([i+4]).format("M/D/YYYY");

        var cardTemp = document.getElementById("cardTemp"+[i]);
        cardTemp.textContent = 'Temp: ' + dataResults.daily[i].temp.day + '°F';

        var cardWind = document.getElementById("cardWind"+[i]);
        cardWind.textContent = 'Wind: ' + dataResults.daily[i].wind_speed + 'MPH';

        var cardHumid = document.getElementById("cardHumid"+[i]);
        cardHumid.textContent = 'Humidity: ' + dataResults.daily[i].humidity + '%';
    }
}

searchFormEl.addEventListener('submit', searchCity);
