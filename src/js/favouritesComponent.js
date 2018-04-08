import { lStorage, getPlaceName } from './services';

class FavouritesComponent {
  constructor(element, eventBus) {
    this.favourites;
    lStorage
      .getData('favourites')
      .then((e) => (this.favourites = JSON.parse(e) || []))
      .then(() => {
        this.eventBus = eventBus;
        this.element = element;
        this.favouritesApplet = document.createElement('ul');
        this.favouritesApplet.id = 'favourites';
        this.favouritesApplet.className = 'favourites';
        this.element.appendChild(this.favouritesApplet);
        this.render();
        this.favouritesApplet.addEventListener('click', (event) => {
          if (event.toElement.nodeName === 'LI') {
            this.eventBus.trigger('map:centerMoved', this.favourites[event.target.dataset.id].coordinates);
          }
          if (event.toElement.nodeName === 'BUTTON') {
            this.removePlace(event.target.dataset.id);
          }
        });
        this.eventBus.on('favourites:add', (coordinates) => {
          this.addPlace(coordinates);
        });
      });
  }
  onClick(event) {}
  addPlace(coordinates) {
    getPlaceName(coordinates)
      .then((e) => {
        this.favourites.push({ name: e, coordinates });
        lStorage.setData('favourites', JSON.stringify(this.favourites));
      })
      .then(() => {
        this.render();
      });
  }
  removePlace(index) {
    this.favourites.splice(index, 1);
    lStorage.setData('favourites', JSON.stringify(this.favourites)).then(() => {
      this.render();
    });
  }
  render() {
    this.favouritesApplet.innerHTML = this.favourites.map((element, index) => `<li data-id='${index}'>${element.name}<button data-id='${index}'>x</button></li>`).join('\n');
  }
}

export { FavouritesComponent };
