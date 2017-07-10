import jsonp from './jsonp.js';

'use strict';

export const fetchCoords = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve([position.coords.latitude, position.coords.longitude]);
        }, error => {
            reject(new Error('Unable to obtain location!'));
        });
    });
}

export const parseCoords = coords => {
    return new Promise((resolve, reject) => {
        if (coords.length !== 2) {
            reject(new Error ('Inncorent coordinates!'));
        }  else {
            coords.forEach(coord => {
                if (typeof coord !== 'number' || Number.isNaN(coord) || !isFinite(coord)) {
                    reject(new Error ('Inncorent coordinates!'));
                }
            });
        }

        resolve(coords);
    });
}

export const fetchCityInfo = (value, key) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${key}`;

    return fetch(url).then(response => response.json());
}

export const parseCityInfo = data => {
    if (!data.status === 'OK') {
        throw new Error('Incorrect data status');
    } 

    return {
        address: data.results[0].formatted_address,
        coords: [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
    }
}

export const fetchWeatherInfo = (coords, key) => {
    const [lat, lon] = coords;
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;

    return jsonp(url).then(response => response.json());
}

export const parseWeatherInfo = data => {
    return {
        country: data.sys.country,
        time: new Date(data.dt * 1000),
        city: data.name,
        temp: data.main.temp,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
        description: {
            info: data.weather[0].description,
            icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
        }
    };
}

export const fetchWikiInfo = value => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${value}`;

    return jsonp(url).then(response => response.json());
}

export const parseWikiInfo = data => {
    const info = Object.values(data.query.pages)[0];
    // console.log(data);
    return {
        title: info.title,
        link: `http://en.wikipedia.org/?curid=${info.pageid}`,
        extract: info.extract
    }
}




