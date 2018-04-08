import { getUserCoordinates, changeHashByMapState } from './services';
import { debounce } from './utils';
/**
 *
 */
class YandexMap {
  /**
   *
   * @param {string} elementId
   * @argument {number} lat
   * @argument {number} lng
   * @argument {lat, lng} coordinates
   */
  constructor(elementId, ymaps, eventBus, coordinates) {
    this.ymaps = ymaps;
    this.eventBus = eventBus;
    this.elementId = elementId;
    this.center = [];
    this.coordinates = coordinates;
    this.setCenter(this.coordinates);
    this.ymaps.ready(() => this.drawMap());
  }
  drawMap() {
    this.map = new this.ymaps.Map(this.elementId, {
      center: this.center,
      zoom: 7,
      controls: ['zoomControl'],
    });
    this.eventBus.trigger('map:loaded');
    this.eventBus.trigger('map:centerChange', this.coordinates);

    let favouritesButton = new ymaps.control.Button({
      data: {
        image: '../img/favourite.png',
        content: 'Add to favourites',
        title: 'Add to favourites',
      },
      options: {
        selectOnClick: false,
        maxWidth: [16],
      },
    });
    favouritesButton.events.add('press', () => {
      this.eventBus.trigger('favourites:add', this.map.getCenter());
    });
    this.map.controls.add(favouritesButton, {
      float: 'right',
      floatIndex: 100,
    });
    this.addHanders();
    this.centerMarker = new this.ymaps.Placemark(this.center);
    this.map.geoObjects.add(this.centerMarker);
  }
  addHanders() {
    this.map.events.add(
      'boundschange',
      debounce((e) => {
        this.eventBus.trigger('map:centerChange', e.get('newCenter'));
        changeHashByMapState(e.get('newCenter'));
        this.centerMarker.geometry.setCoordinates(e.get('newCenter'));
      }, 300)
    );
    this.eventBus.on('map:centerMoved', (coordinates) => {
      this.moveCenter(coordinates);
    });
  }

  setCenter(coordinates) {
    this.center = coordinates;
  }
  moveCenter(coordinates) {
    debugger;
    this.map.panTo(coordinates, { flying: 'true' });
  }
  returnCenter() {
    return this.map.getCenter();
  }
}

export { YandexMap };
