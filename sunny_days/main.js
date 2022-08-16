window.addEventListener("load", () => {
  let long;
  let lat;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      key = "ccfcdfc303d2768c571a2235592b7b16";
      long = position.coords.longitude;
      lat = position.coords.latitude;

      let weather_api = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=&appid=" + key;

      let geo_api = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + lat + "&lon=" + long + "&limit=5&appid=" + key;

      fetch(geo_api).then(response => {
        return response.json();
      })
      .then(loc => {
        console.log(loc);
        const{name} = loc[0];
        console.log(name);
        document.querySelector(".location").innerText = "Weather in: " + name;
      })

      fetch(weather_api).then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        const {temp, humidity, sunset} = data.current;
        const {main, icon} = data.current.weather[0];
        const {sunrise} = data.daily[1];
        const current_day_sunrise = data.current.sunrise;

        document.querySelector(".temperature").innerText = temp + "°F";
        document.querySelector(".weather-description").innerText = main;
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        var icon_url = "http://openweathermap.org/img/wn/" + icon + ".png";
        document.getElementById("weather_icon").src = icon_url;

        //make a way to display the current sunrise time if it has not passed yet
        const sunrise_time = (current_day_sunrise, sunrise) => {
          var sunrise_date;
          var sunrise_full_date;
          var sr_date;
          if (current_day_sunrise < sunrise) { 
            sunrise_date = new Date(current_day_sunrise * 1000);
            sunrise_full_date = sunrise_date.toGMTString() + "<br>" + sunrise_date.toLocaleString();
            sr_date = sunrise_full_date.split(",");
            return sr_date[2];
          }
          else {
            sunrise_date = new Date(sunrise * 1000);
            sunrise_full_date = sunrise_date.toGMTString() + "<br>" + sunrise_date.toLocaleString();
            sr_date = sunrise_full_date.split(",");
            return sr_date[2];
          }
        };

        var sunset_date = new Date(sunset * 1000);
        var sunset_full_date = sunset_date.toGMTString() + "<br>" + sunset_date.toLocaleString();
        let ss_date = sunset_full_date.split(",");
        sunset_time = ss_date[2];

        document.querySelector(".sunrise").innerText = ("Sunrise: " + sunrise_time(current_day_sunrise, sunrise));
        document.querySelector(".sunset").innerText = ("Sunset: " + sunset_time); 
      })
      
    });
  }
});
