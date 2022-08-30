let long;
let lat;
let temperature_section = document.querySelector(".temperature");
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      key = "ccfcdfc303d2768c571a2235592b7b16";
      long = position.coords.longitude;
      lat = position.coords.latitude;

      let weather_api = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=&appid=" + key;

      let geo_api = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + lat + "&lon=" + long + "&limit=5&appid=" + key;

      getLocation(geo_api);
      getWeather(weather_api);
    });
  }
  //gets the name of your location based on long and lat from geolocation
  function getLocation(location) {
    fetch(location).then(response => {
      return response.json();
    })
    .then(loc => {
      console.log(loc);
      const{name} = loc[0];
      console.log(name);
      document.querySelector(".location").innerText = "Weather in: " + name;
    })
  }

  //gets the weather data from open weather api
  function getWeather(weather) {
    fetch(weather).then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      let {temp, humidity, sunset} = data.current;
      const {main, icon} = data.current.weather[0];
      const {sunrise} = data.daily[1];
      const current_day_sunrise = data.current.sunrise;

      temperature_section.textContent = temp + "°F";
      document.querySelector(".weather-description").innerText = main;
      document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
      var icon_url = "http://openweathermap.org/img/wn/" + icon + ".png";
      document.getElementById("weather_icon").src = icon_url;

      //converts temp to fahreheit
      f_btn = document.querySelector(".fahrenheit");
      f_btn.addEventListener('click', () => {
        temperature_section.textContent = temp + "°F";
      });
      
      //converts temp to celcius
      c_btn = document.querySelector(".celcius");
      c_btn.addEventListener('click', () => {
        let c = (temp - 32) * (5/9);
        c = c.toFixed(2);
        temperature_section.textContent = c + "°C";
      });

      //a way to display the current sunrise time if it has not passed yet
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
  }