
const APIkey = "e57eb02252a8e563b6e486b7febc7d1c"; 

let buttons = [];
const numberBtns = 6;

checkAdd();

$("#search-button").on("click", function(event) {
    event.preventDefault(); 
    
    let cityName = $(this).prev().val().trim(); 
    totalFetch(cityName);

    let btnCity = upperFirstLetter(cityName);   
    pushBtn(btnCity);
    renderBtn();

    $("#search-input").val("");   
});

$("#history").on("click", ".user-button", function(event) {
    event.preventDefault();
    let btnName = $(this).text().trim(); 
    totalFetch(btnName);
});

function totalFetch(city) {
    let locationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIkey}`;

    fetch(locationURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let lat = data[0].lat;
            let lon = data[0].lon;            
        
            let todayURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`; 

            fetch(todayURL)   
                .then(function(result) {            
                    return result.json();
                })
                .then(function(data) {                                                      
                    let currentDate = dayjs.unix(data.dt).format("DD/M/YYYY");
                    let todayImg = data.weather[0].icon;
                    $("#today").text("");
                    $("#today").append(`<div class="card border border-1 border-dark p-2">
                                        <h3>${data.name} (${currentDate}) <img src="https://openweathermap.org/img/wn/${todayImg}@2x.png" width="50px" height="50px"/></h3>
                                        <p>Temp: ${(data.main.temp - 273.15).toFixed(2)} °C</p>
                                        <p>Wind: ${data.wind.speed} KPH</p>
                                        <p>Humidity: ${data.main.humidity} %</p>
                                        </div>`);                                          
                });
            
            let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;
    
            fetch(forecastURL)
                .then(function(result) {
                    return result.json();
                })
                .then(function(data) {
                    $("#forecast").text("");
                    $("#forecast").append(`<h4 class="px-0">5-Day Forecast:</h4>`);
                    
                    let dateList = [];
                    for (let i=5; i>0; i--) {
                        let nextDate = data.list.find(obj => obj.dt === getNextDay(i, 12));
                        let altDate = data.list.find(obj => obj.dt === getNextDay(i, 0));
                        if (nextDate) {                            
                            dateList.unshift(nextDate); 
                        } else {                            
                            dateList.unshift(altDate);
                        }                            
                    }                    
                    
                    for (let i=0; i<dateList.length; i++) {
                        let forecastDate = dayjs.unix(dateList[i].dt).format("DD/M/YYYY");
                        let forecastImg = dateList[i].weather[0].icon;
                        
                        $("#forecast").append(`<div class="forecast-card card col-md p-1 mb-4">
                                            <h5>${forecastDate}</h5>
                                            <img src="https://openweathermap.org/img/wn/${forecastImg}@2x.png" width="50px" height="50px"/>
                                            <p>Temp: ${(dateList[i].main.temp - 273.15).toFixed(2)} °C</p>
                                            <p>Wind: ${dateList[i].wind.speed} KPH</p>
                                            <p>Humidity: ${dateList[i].main.humidity} %</p>
                                            </div>`);
                    }                        
                });
        });            
    }

function getNextDay(day, hour) {
    let next = dayjs().add(day, 'day').hour(hour).startOf('hour').unix();
    return next;
}

function upperFirstLetter(str) {
    const words = str.split(" ");
    const capWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    })
    const result = capWords.join(" ");
    return result;
}

function pushBtn(name) {
    if(name && !buttons.includes(name)) {
        buttons.unshift(name);
        if(buttons.length > numberBtns) {
            buttons = buttons.slice(0, numberBtns);
        }
    } else if(buttons.includes(name)) {        
        return;
    } else {
        alert("Enter the name of the city")        
    };   

    storeUserData();
}

function renderBtn() {
    $("#history").empty(); 
    for (let i=0; i<buttons.length; i++) {
        $("#history").append(`<button type="submit" class="btn mb-3 user-button">${buttons[i]}</button>`)
    }    
}

function storeUserData() {
    localStorage.setItem("buttons", JSON.stringify(buttons));
}

function checkAdd() {    
    let storedData = JSON.parse(localStorage.getItem("buttons"));    
    if (storedData !== null) {
        buttons = storedData;
    }
    renderBtn()
}