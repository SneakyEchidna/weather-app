import { getCoordinatesByName, getForecastByLatLng, getForecastByName, getInitialCoordinates } from './services';
import { EventBus } from './eventBus';
import { WeatherComponent } from './weatherComponent';
import { YandexMap } from './map';
import { HistoryComponent } from './historyComponent';
import { Search } from './searchComponent';
import { FavouritesComponent } from './favouritesComponent';

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

let favouritesContainer = document.createElement('div');
favouritesContainer.className = 'favouritesContainer';

root.appendChild(header);
root.appendChild(mapContainer);
root.appendChild(infoContainer);
infoContainer.appendChild(historyContainer);
infoContainer.appendChild(weatherContainer);
infoContainer.appendChild(favouritesContainer);
mapContainer.appendChild(map);

historyContainer.innerHTML = '<h4>History</h4>';
weatherContainer.innerHTML = '<h4>Weather</h4>';
favouritesContainer.innerHTML = '<h4>Favourites</h4>';
let forecast = new WeatherComponent(weatherContainer, eventBus);
let history = new HistoryComponent(historyContainer, eventBus);
let favourites = new FavouritesComponent(favouritesContainer, eventBus);
getInitialCoordinates().then((coordinates) => (m = new YandexMap('map', ymaps, eventBus, coordinates)));

export { m };
