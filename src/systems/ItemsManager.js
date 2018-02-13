import Item from '../components/Item';
import Helpers from '../Helpers';

class ItemsManager {
  constructor(client) {
    this.client = client; 
    this.list = this.client.game.cache.getJSON('items').items;
  }

  init() {
    this.validpos = [];
		for (let x = 0; x < this.client.mapsManager.cols; x++) {
			for (let y = 0; y < this.client.mapsManager.rows; y++) {
				if (!this.client.mapsManager.map.tiles[x][y]) {
					this.validpos.push({x: x, y: y});
				}
			}
    }
  }

  create(id, pos, actor) {
    let i, data, item;

    i = this.list.find(function(el) {
      if (el[0] == id || el.id == id) {
        return true;
      }
      return false;
    })

    if (i) {
      data = i;

      let r;
      if (!pos) {
        while (this.validpos.length != this.client.itemsList.length && !pos) {
          r = this.validpos[Helpers.random(this.validpos.length)];
          if (!this.client.itemsMap.hasOwnProperty(r.x + "." + r.y)) {
            pos = this.client.posToCoord(r);
          }
        }
      } else {
        r = this.client.getPosition(pos);
      }

      if (!pos) { return };
      
      item = new Item(this.client, data, pos, actor);
      item.lastPos = {
        x: r.x, y: r.y
      };

      this.client.itemsMap[r.x + "." + r.y] = item;
    }

    return item;
  }
}

export default ItemsManager;