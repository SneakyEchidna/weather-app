const getPlaceName = (coordinates) =>
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[0]}&lon=${coordinates[1]}&units=metric&lang=ru&APPID=97248aca315ea6cccb5cf1cab8b0771b`)
    .then((res) => res.json())
    .then((data) => {
      return data.city.name;
    })
    .catch(() => {
      alert('Ошибка запроса');
    });

const getCoordinatesByName = (address) =>
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDa7DCL2NO9KMPd9DYVk_u3u0wCbm0XXFY&language=EN`)
    .then((req) => req.json())
    .then((data) => {
      return [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, data.results[0].formatted_address, data.status];
    })
    .catch(() => alert("Can't get coordinates"));

const getForecastByLatLng = (coordinates) =>
  fetch(`http://cors-proxy.htmldriven.com/?url=https://api.darksky.net/forecast/d113af5f82393ef553f48314ae9f42e8/${coordinates[0]},${coordinates[1]}?lang=en%26units=si`)
    .then((req) => req.json())
    .then((data) => {
      let forecast = JSON.parse(data.body);
      return {
        summary: { value: forecast.currently.summary, measurement: '' },
        temperature: {
          value: forecast.currently.temperature,
          measurement: 'C°',
        },
        humidity: { value: forecast.currently.humidity, measurement: '%' },
        pressure: { value: forecast.currently.pressure, measurement: 'hPa' },
        'wind speed': {
          value: forecast.currently.windSpeed,
          measurement: 'm/s',
        },
      };
    })
    .catch(() => console.log("Can't get forecast"));

const getForecastByName = (address) => getCoordinatesByName(address).then((coordinates) => getForecastByLatLng(coordinates));

const getInitialCoordinates = () => {
  return new Promise((resolve, reject) => {
    let regExp = /#center=(-?\d*[.]?\d+),(-?\d*[.]?\d+)/;
    let coordinates = window.location.hash.match(regExp);
    let center;
    if (coordinates) {
      center = [coordinates[1], coordinates[2]];
      resolve(center);
    } else resolve(getUserCoordinates().then((center) => center));
  });
};

const getUserCoordinates = () =>
  fetch('https://api.userinfo.io/userinfos')
    .then((req) => req.json())
    .then((data) => [data.position.latitude, data.position.longitude]);

const changeHashByMapState = (center) => {
  window.location.hash = `center=${center}`;
};

const lStorage = {
  setData: (key, value) =>
    new Promise(function(resolve, reject) {
      window.localStorage.setItem(key, value);
      resolve([key, value]);
    }),
  getData: (key) => Promise.resolve(window.localStorage.getItem(key)),
};

export { getCoordinatesByName, getForecastByLatLng, getForecastByName, getInitialCoordinates, changeHashByMapState, lStorage, getPlaceName };
