import {
  getCoordinatesByName,
  getForecastByLatLng,
  getForecastByName,
  getInitialCoordinates,
} from './services';
import { EventBus } from './eventBus';
import { WeatherComponent } from './weatherComponent';
import { YandexMap } from './map';
import { HistoryComponent } from './historyComponent';
import { Search } from './searchComponent';
import { favoritesComponent } from './favoritesComponent';

let m;
let eventBus = new EventBus();
let root = document.getElementById('content');

//generate map element
let map = document.createElement('div');
map.id = 'map';
map.className = 'map';
let mapContainer = document.createElement('div');
mapContainer.className = 'mapContainer';

//generate header element
let header = document.createElement('div');
header.className = 'header';
header.innerHTML = '<label>Search</label>';
let searchbox = new Search(header, eventBus);

//generate info element
let infoContainer = document.createElement('div');
infoContainer.className = 'infoContainer';

let historyContainer = document.createElement('div');
historyContainer.className = 'historyContainer';

let weatherContainer = document.createElement('div');
weatherContainer.className = 'weatherContainer';

let favoritesContainer = document.createElement('div');
favoritesContainer.className = 'favoritesContainer';

root.appendChild(header);
root.appendChild(mapContainer);
root.appendChild(infoContainer);
infoContainer.appendChild(historyContainer);
infoContainer.appendChild(weatherContainer);
infoContainer.appendChild(favoritesContainer);
mapContainer.appendChild(map);

historyContainer.innerHTML = '<h4>History</h4>';
weatherContainer.innerHTML = '<h4>Weather</h4>';
favoritesContainer.innerHTML = '<h4>favorites</h4>';
let forecast = new WeatherComponent(weatherContainer, eventBus);
let history = new HistoryComponent(historyContainer, eventBus);
let favorites = new favoritesComponent(favoritesContainer, eventBus);
getInitialCoordinates().then(
  (coordinates) => (m = new YandexMap('map', ymaps, eventBus, coordinates))
);

export { m };
