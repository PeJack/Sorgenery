import ROT from 'rot-js';

class Map {
    constructor(client, rotmap, phasermap, cols, rows) {
        this.client = client;
        
        this.rotmap = rotmap;
        this.phasermap = phasermap;
        this.rows = rows;
        this.cols = cols;
        this.tiles = JSON.parse(JSON.stringify(this.rotmap.map));
    }

    exist(x, y) {
        return (typeof this.rotmap.map[x] !== 'undefined' && typeof this.rotmap.map[x][y] !== 'undefined' && this.rotmap.map[x][y] === 0) ? '1' : '0';        
    }

    canGo(direction) {
        direction.x = Math.round(direction.x);
        direction.y = Math.round(direction.y);

        return direction.x >= 0 &&
        direction.x < this.rows &&
        direction.y >= 0 &&
        direction.y < this.cols &&
        this.tiles[direction.x][direction.y] === 0;
    }

    light() {
        let self = this;
        let lightPasses = function (x, y) {
            x = Math.round(x);
            y = Math.round(y);
            return typeof self.tiles[x] === 'undefined' || typeof self.tiles[x][y] === 'undefined' || self.tiles[x][y] === 0;
        };

        this.resetLight();
        this.fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
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
                    }
                }


                tile = this.phasermap.getTile(x, y, 1);
                if (tile) {
                    if (tile.explored) {
                        tile.alpha = 0.1;
                    } else {
                        tile.alpha = 0;
                    }
                }

            }
        }
    }

    computeLight() {
        this.resetLight();
        let self = this;

        this.client.entityList.forEach(function(entity) {
            entity.sprite.alpha = 0;
        });

        this.client.player.sprite.alpha = 1;
        let currentDirection = this.client.player.currentDirection;
        this.fov.compute(this.client.player.position.x, this.client.player.position.y, 10, function (x, y, r, visibility) {
            x = Math.round(x);
            y = Math.round(y);

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

            // if (self.client.entityMap.hasOwnProperty(x + '_' + y)) {
            //     self.client.entityMap[x + '_' + y].sprite.alpha = visibility;
            // }
        });

        this.phasermap.layers[0].dirty = true;
        this.phasermap.layers[1].dirty = true;
    }    
}

export default Map;