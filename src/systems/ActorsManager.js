import Player from '../objects/Player';

class ActorsManager {
  constructor(client) {
	  this.client = client;
  }

  init() {
	  this.client.actorsList = [];
	  this.client.actorsMap = {};
	  let actor, x, y;

	  let random = function(max) {
	  	return Math.floor(Math.random() * max);
    };
    
    let validpos = [];
		for (x = 0; x < this.client.mapsManager.cols; x++) {
			for (y = 0; y < this.client.mapsManager.rows; y++) {
				if (!this.client.mapsManager.map.tiles[x][y]) {
					validpos.push({x: x, y: y});
				}
			}
    }
    
    for (let e = 0; e < 1; e++) {
			do {
				let r = validpos[random(validpos.length)];
				x = r.x;
				y = r.y;
			} while (this.client.actorsMap[x + '_' + y]);

			actor = new Player(this.client, x, y);

			this.client.actorsMap[actor.sprite.x + '_' + actor.sprite.y] = actor;
			this.client.actorsList.push(actor);
		}
  }
}

export default ActorsManager;