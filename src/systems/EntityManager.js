import Player from '../objects/Player';

class EntityManager {
  constructor(client) {
	  this.client = client;
  }

  init() {
	  this.client.entityList = [];
	  this.client.entityMap = {};
	  let entity, x, y;

	  let random = function(max) {
	  	return Math.floor(Math.random() * max);
    };
    
    let validpos = [];
		for (x = 0; x < this.client.levelManager.cols; x++) {
			for (y = 0; y < this.client.levelManager.rows; y++) {
				if (!this.client.levelManager.map.tiles[x][y]) {
					validpos.push({x: x, y: y});
				}
			}
    }
    
    for (let e = 0; e < 1; e++) {
			do {
				let r = validpos[random(validpos.length)];
				x = r.x;
				y = r.y;
			} while (this.client.entityMap[x + '_' + y]);

			entity = new Player(this.client, x, y);
			this.client.entityMap[entity.sprite.x + '_' + entity.sprite.y] = entity;
			this.client.entityList.push(entity);
		}
  }
}

export default EntityManager;