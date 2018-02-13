import Player from '../components/Player';
import Enemy from '../components/Enemy';
import Helpers from '../Helpers';

class ActorsManager {
  constructor(client) {
    this.client = client;
    this.list = [
      {id: 1, damage: 10, title: "Orc", isPlayer: false}
    ]
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

  create(id, pos) {
    let a, data, actor;

    if (id == 0) {
      a = {isPlayer: true};
    } else {
      a = this.list.find(function(el) {
        if (el[0] == id || el.id == id) {
          return true;
        }
        return false;
      })
    }

    if (a) {
      data = a;
      
      let r;
      if (!pos) {
        while (this.validpos.length != this.client.actorsList.length && !pos) {
          r = this.validpos[Helpers.random(this.validpos.length)];
          if (!this.client.actorsMap.hasOwnProperty(r.x + "." + r.y)) {
            pos = r // this.client.posToCoord(r);
          }
        }
      } else {
        r = pos;
      }

      if (!pos) { return };
      
      if (data.isPlayer) {
        actor = new Player(this.client, data, pos);
      } else {
        actor = new Enemy(this.client, data, pos);
      }

      if (!actor.isPlayer) {
        this.client.actorsList.push(actor);
        this.client.actorsMap[r.x + "." + r.y] = actor;
      }
    }

    return actor;
  }
}

export default ActorsManager;