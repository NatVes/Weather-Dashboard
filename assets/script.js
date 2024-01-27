
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

            let queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;            

            return fetch(queryURL);            
        })
        .then(function(result) {            
            return result.json();
        })
        .then(function(data) {
            console.log(data);
            


        })
    
    $("#search-input").val("");
})