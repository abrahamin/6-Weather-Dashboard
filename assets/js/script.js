var APIKey = "23698a8b82c09505e9e6c16024c08515";

var searchFormEl = document.querySelector('#search-form');
var weatherContentEl = document.querySelector('#weather-content');

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
        var cityTitle = document.querySelector('#city-title');
        cityTitle.textContent = coordinates.name;

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
            // for (var i = 0; i < data.length; i++) {
            //     printResults(data.results[i]);
            // }
            printResults(data);
        })
        .catch(function (error) {
            console.error(error);
        })
    }
};

function printResults(dataResults) {
    console.log(dataResults);

    var resultCard = document.createElement('div');
    // resultCard.classList.add('card,border,border-dark');

    var infoOne = document.createElement('p');
    infoOne.textContent = 'Temp: ' + dataResults.current.temp + '°F';

    var infoTwo = document.createElement('p');
    infoTwo.textContent = 'Wind: ' + dataResults.current.wind_speed + 'MPH';

    var infoThree = document.createElement('p');
    infoThree.textContent = 'Humidity: ' + dataResults.current.humidity + '%';

    var infoFour = document.createElement('p');
    infoFour.textContent = 'UV Index: ';

    var infoFive = document.createElement('span');
    infoFive.classList.add('uv-index');
    infoFive.textContent = dataResults.current.uvi;

    if (dataResults.current.uvi < 3) {
        infoFive.style.backgroundColor = '#00FF00';
    } else if (dataResults.current.uvi < 6) {
        infoFive.style.backgroundColor = '#FFFF00';
    } else if (dataResults.current.uvi >= 7) {
        infoFive.style.backgroundColor = '#FFA500';
    };


    resultCard.append(infoOne, infoTwo, infoThree, infoFour);
    infoFour.append(infoFive);
    weatherContentEl.append(resultCard);
}

searchFormEl.addEventListener('submit', searchCity);
