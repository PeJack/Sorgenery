import ROT from 'rot-js';

class Map {
  constructor(client, rotmap, phasermap, cols, rows) {
    this.client = client;
      
    this.rotmap = rotmap;
    this.phasermap = phasermap;
    this.rows = rows;
    this.cols = cols;
    this.tiles = JSON.parse(JSON.stringify(this.rotmap.map));

    let self = this;
    this.passableCb = function (x, y) {
      x = Math.round(x);
      y = Math.round(y);
      return typeof self.tiles[x] === 'undefined' || typeof self.tiles[x][y] === 'undefined' || self.tiles[x][y] === 0;
    };
  }

  exist(x, y) {
    return (typeof this.rotmap.map[x] !== 'undefined' && typeof this.rotmap.map[x][y] !== 'undefined' && this.rotmap.map[x][y] === 0) ? '1' : '0';        
  }

  light() {
    this.resetLight();
    this.fov = new ROT.FOV.PreciseShadowcasting(this.passableCb);
    this.computeLight();
  }

  resetLight() {
    let tile, x, y;
    for (x = 0; x < this.cols; x++) {
      for (y = 0; y < this.rows; y++) {
        tile = this.phasermap.getTile(x, y, 0);
        if (tile) {
          if (tile.explored) {
            tile.alpha = 0.1;
          } else {
            tile.alpha = 0;
            tile.visible = false; 
          }
        }

        tile = this.phasermap.getTile(x, y, 1);
        if (tile) {
          if (tile.explored) {
            tile.alpha = 0.1;
          } else {
            tile.alpha = 0;
            tile.visible = false;             
          }
        }

        if (this.client.actorsMap.hasOwnProperty(x + "." + y)) {
          this.client.actorsMap[x + "." + y].sprite.alpha = 0;
          this.client.actorsMap[x + "." + y].visibleForPlayer = false;
        }

        if (this.client.itemsMap.hasOwnProperty(x + "." + y)) {
          this.client.itemsMap[x + "." + y].alpha = 0;
        }
      }
    }
  }

  computeLight() {
    this.resetLight();
    let self = this;
    // this.client.actorsList.forEach(function(entity) {
    //     entity.sprite.alpha = 0;
    // });

    this.client.player.sprite.alpha = 1;
    
    this.fov.compute(this.client.player.position.x, this.client.player.position.y, 10, function (x, y, r, visibility) {
      let tile = self.phasermap.getTile(x, y, 0);
      
      if (tile) {
        tile.alpha = visibility;
        tile.explored = true;
      }

      tile = self.phasermap.getTile(x, y, 1);
      if (tile) {
        tile.alpha = visibility;
        tile.explored = true;
      }

      if (self.client.actorsMap.hasOwnProperty(x + "." + y)) {
        self.client.actorsMap[x + "." + y].sprite.alpha = visibility;
        self.client.actorsMap[x + "." + y].visibleForPlayer = true;
      }

      if (self.client.itemsMap.hasOwnProperty(x + "." + y)) {
        self.client.itemsMap[x + "." + y].alpha = visibility;
      }
    });

    this.phasermap.layers[0].dirty = true;
    this.phasermap.layers[1].dirty = true;
  }
  
  computeVisibilityBetween(actor1, actor2) {
    let self = this, visible = false;
    this.fov.compute(actor1.position.x, actor1.position.y, 7, function (x, y, r, visibility) {
      if (self.client.actorsMap.hasOwnProperty(x + "." + y)) {
        if (self.client.actorsMap[x + "." + y] == actor2) {
          visible = true;
        }
      }
    });

    return visible;
  }

  pathfinding(actor1, actor2) {
    let astar = new ROT.Path.AStar(actor2.position.x, actor2.position.y, this.passableCb);
    let path = [];
    astar.compute(actor1.position.x, actor1.position.y, function(x, y) {
      path.push({x: x, y: y});
    });

    return path;
  }
}

export default Map;