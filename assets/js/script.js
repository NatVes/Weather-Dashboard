
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
    let cityName = $(this).text().trim(); 
    totalFetch(cityName);
});

function totalFetch(cityName) {
    let locationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIkey}`;

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
                    console.log(data);                                   
                    let currentDate = dayjs.unix(data.dt).format("DD/M/YYYY");
                    let todayImg = data.weather[0].icon;
                    $("#today").text("");
                    $("#today").append(`<div class="border border-1 border-dark p-2">
                                        <h3><span data-name="${data.name}">${data.name}</span> (${currentDate}) <img src="https://openweathermap.org/img/wn/${todayImg}@2x.png" width="50px" height="50px"/></h3>
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
                    console.log(data);
                    let currentDate = dayjs();
                    let nextDate = currentDate.add(1, "day");
                    
                    for (let i=0; i<5; i++) {
                        nextDate;
                        let targetDate = `${nextDate.format("YYYY-MM-DD")} 12:00:00`;
                        let targetObj = data.list.find(obj => obj.dt_txt === targetDate);
                        let forecastDate = dayjs(targetObj.dt_txt).format("DD/M/YYYY");
                        let forecastImg = targetObj.weather[0].icon;
                        console.log(targetObj);
                        $("#forecast").append(`<div class="col-md p-1 mb-4 forecast-card">
                                                <h5>${forecastDate}</h5>
                                                <img src="https://openweathermap.org/img/wn/${forecastImg}@2x.png" width="50px" height="50px"/>
                                                <p>Temp: ${(targetObj.main.temp - 273.15).toFixed(2)} °C</p>
                                                <p>Wind: ${targetObj.wind.speed} KPH</p>
                                                <p>Humidity: ${targetObj.main.humidity} %</p>
                                                </div>`);
                        nextDate = nextDate.add(1, "day");
                    }    
                });            
        }); 
}

function upperFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function pushBtn(name) {
    $("#history").empty();   

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
    for (let i=0; i<buttons.length; i++) {
        $("#history").append(`<button type="submit" class="btn mb-3 user-button">${buttons[i]}</button>`)
    }    
}

function storeUserData () {
    localStorage.setItem("buttons", JSON.stringify(buttons));
}

function checkAdd() {    
    let storedData = JSON.parse(localStorage.getItem("buttons"));    
    if (storedData !== null) {
        buttons = storedData;
    }
    renderBtn()
}