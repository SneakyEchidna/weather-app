import { lStorage, getPlaceName } from './services';

class favoritesComponent {
  constructor(element, eventBus) {
    this.favorites;
    lStorage
      .getData('favorites')
      .then((e) => (this.favorites = JSON.parse(e) || []))
      .then(() => {
        this.eventBus = eventBus;
        this.element = element;
        this.favoritesApplet = document.createElement('ul');
        this.favoritesApplet.id = 'favorites';
        this.favoritesApplet.className = 'favorites';
        this.element.appendChild(this.favoritesApplet);
        this.render();
        this.favoritesApplet.addEventListener('click', (event) => {
          if (event.toElement.nodeName === 'LI') {
            this.eventBus.trigger(
              'map:centerMoved',
              this.favorites[event.target.dataset.id].coordinates
            );
          }
          if (event.toElement.nodeName === 'BUTTON') {
            this.removePlace(event.target.dataset.id);
          }
        });
        this.eventBus.on('favorites:add', (coordinates) => {
          this.addPlace(coordinates);
        });
      });
  }
  onClick(event) {}
  addPlace(coordinates) {
    getPlaceName(coordinates)
      .then((e) => {
        this.favorites.push({ name: e, coordinates });
        lStorage.setData('favorites', JSON.stringify(this.favorites));
      })
      .then(() => {
        this.render();
      });
  }
  removePlace(index) {
    this.favorites.splice(index, 1);
    lStorage.setData('favorites', JSON.stringify(this.favorites)).then(() => {
      this.render();
    });
  }
  render() {
    this.favoritesApplet.innerHTML = this.favorites
      .map(
        (element, index) =>
          `<li data-id='${index}'>${
            element.name
          }<button data-id='${index}'>x</button></li>`
      )
      .join('\n');
  }
}

export { favoritesComponent };
