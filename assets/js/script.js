
const APIkey = "e57eb02252a8e563b6e486b7febc7d1c"; 

$("#search-button").on("click", function(event) {
    event.preventDefault();  
    
    let cityName = $(this).prev().val().trim();    

    let locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIkey}`;

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
                    $("#today").text("");
                    $("#today").append(`<div class="border border-1 border-dark p-2">
                                        <h3>${data.name} (${currentDate})</h3>
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
                    let currentDate = dayjs(data.list[0].dt_txt);
                    let nextDate = currentDate.add(1, "day");
                    console.log(currentDate);
                    for (let i=0; i<5; i++) {
                        nextDate;
                        let targetDate = `${nextDate.format("YYYY-MM-DD")} 12:00:00`;
                        let targetObj = data.list.find(obj => obj.dt_txt === targetDate);
                        let forecastDate = dayjs(targetObj.dt_txt).format("DD/M/YYYY");
                        console.log(targetObj);
                        $("#forecast").append(`<div class="col bg-secondary p-1">
                                                <h5>${forecastDate}</h5>
                                                <p>Temp: ${(targetObj.main.temp - 273.15).toFixed(2)} °C</p>
                                                <p>Wind: ${targetObj.wind.speed} KPH</p>
                                                <p>Humidity: ${targetObj.main.humidity} %</p>
                                                </div>`);
                        nextDate = nextDate.add(1, "day");
                    }

                    
                                        
                })
        });
            

        
    
    
    $("#search-input").val("");
    
})