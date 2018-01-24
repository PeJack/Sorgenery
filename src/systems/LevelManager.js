// import VisibilityPolygon from 'systems/VisibilityPolygon';
// import Segment from 'systems/Segment';
import Map from 'systems/Map';
import ROT from 'rot-js';

class LevelManager {
  constructor(client) {
    this.client = client;
    // this.map = this.client.game.add.tilemap('lvl1');
    // this.map.addTilesetImage('tiles', 'tiles') 
    // this.client.layers.background = this.map.createLayer('backgroundLayer');
    // this.client.layers.collisions = this.map.createLayer('blockedLayer');
    // this.map.setCollisionByExclusion([], true, this.client.layers.collisions)  
    // this.tiles = this.client.layers.background.getTiles(0, 0, this.client.game.width, this.client.game.height, true, true);
    // this.segments = this.createSegmentsFromTiles();
    // this.vp = new VisibilityPolygon(this.segments, this.client.game.world.width, this.client.game.world.height);
    
    this.cols = 50;
    this.rows = 50;
    this.tilesize = this.client.tilesize;

    this.mapData = this.generateMap('Map', this.client.cache, this.rows, this.cols, this.tilesize, this.tilesize);
  }

  init() {
    let map = this.client.game.add.tilemap('Map');
    map.addTilesetImage('forest-tiles', 'forest-tiles');
    
    this.client.layers.ground = map.createLayer('ground');
    this.client.layers.ground.resizeWorld();
    this.client.layers.decoration = map.createLayer('decoration');
    this.client.layers.decoration.resizeWorld();
	// map.setCollisionByExclusion([], true, this.client.layers.decoration)  
	
	this.map = new Map(this.client, this.mapData, map, this.cols, this.rows);
  }

  getNormalizedPolygons() {
        let polygons, poly, lastPoly, nextPoly;
        polygons = [];

        if (this.map.objects.collision) {
            this.map.objects.collision.forEach(function(collision) {
                lastPoly = null;
                nextPoly = null;

                if (collision.rectangle) {
                    polygons.push({
                        a: {
                            x: collision.x, 
                            y: collision.y
                        }, 
                        b: {
                            x: collision.x + collision.width,
                            y: collision.y
                        }
                    })

                    polygons.push({
                        a: {
                            x: collision.x + collision.width, 
                            y: collision.y
                        }, 
                        b: {
                            x: collision.x + collision.width,
                            y: collision.y + collision.height
                        }
                    })

                    polygons.push({
                        a: {
                            x: collision.x + collision.width, 
                            y: collision.y + collision.height
                        }, 
                        b: {
                            x: collision.x,
                            y: collision.y + collision.height
                        }
                    })

                    polygons.push({
                        a: {
                            x: collision.x, 
                            y: collision.y + collision.height
                        }, 
                        b: {
                            x: collision.x, 
                            y: collision.y
                        }
                    })
                } else if (collision.polyline) {
                    for(let i = 0; i < collision.polyline.length; i++) {
                        poly = collision.polyline[i];
                        nextPoly = collision.polyline[i + 1];

                        if (!nextPoly) { continue; }

                        if (lastPoly) {
                            polygons.push({
                                a: {
                                    x: collision.x + lastPoly.x, 
                                    y: collision.y + lastPoly.y
                                }, 
                                b: {
                                    x: collision.x + poly[0], 
                                    y: collision.y + poly[1]
                                }
                            })
                        } else {
                            polygons.push({
                                a: {
                                    x: collision.x + poly[0], 
                                    y: collision.y + poly[1]
                                }, 
                                b: {
                                    x: collision.x + nextPoly[0], 
                                    y: collision.y + nextPoly[1]
                                }
                            })
                        }
                    }
                }
            })
        }
        return polygons;
  }

  createSegmentsFromTiles() {
        let segments = [], segment;

        this.tiles.forEach(function(tile) {
            if(!!tile.faceBottom) {
              segment = new Segment();
              segment.start.x = tile.left;
              segment.end.x = tile.right;
              segment.start.y = tile.bottom;
              segment.end.y = tile.bottom;
              segment.tile = tile;

              if(!(segment in segments)) {
                segments.push(this.calculateSegmentProperties(segment));
              }
            }

            if(!!tile.faceTop) {
              segment = new Segment();
              segment.start.x = tile.left;
              segment.end.x = tile.right;
              segment.start.y = tile.top;
              segment.end.y = tile.top;
              segment.tile = tile;

              if(!(segment in segments)) {
                segments.push(this.calculateSegmentProperties(segment));
              }
            }
            if(!!tile.faceLeft) {
              segment = new Segment();
              segment.start.x = tile.left;
              segment.end.x = tile.left;
              segment.start.y = tile.top;
              segment.end.y = tile.bottom;
              segment.tile = tile;

              if(!(segment in segments)) {
                segments.push(this.calculateSegmentProperties(segment));
              }
            }
            if(!!tile.faceRight) {
              segment = new Segment();
              segment.start.x = tile.right;
              segment.end.x = tile.right;
              segment.start.y = tile.top;
              segment.end.y = tile.bottom;
              segment.tile = tile;

              if(!(segment in segments)) {
                segments.push(this.calculateSegmentProperties(segment));
              }
            }

            return segments;
        }, this);

        return segments;
  }

  calculateSegmentProperties(segment) {
        segment.direction.x = segment.end.x - segment.start.x;
        segment.direction.y = segment.end.y - segment.start.y;
        segment.magnitude = Math.sqrt(Math.pow(segment.direction.x, 2) + Math.pow(segment.direction.y, 2));
        return segment;
  }

  generateMap(keyName, _cache, width, height, tilewidth, tileheight) {
    var _map = new ROT.Map.Rogue(width, height);
    
	var jsonmap = {
	  	layers: [{
	  		data: new Array(width * height),
	  		height: height,
	  		name: 'ground',
	  		opacity: 1,
	  		type: 'tilelayer',
	  		visible: true,
	  		width: width,
	  		x: 0,
	  		y: 0
	  	}, {
	  		data: [],
	  		height: height,
	  		name: 'decoration',
	  		opacity: 1,
	  		type: 'tilelayer',
	  		visible: true,
	  		width: width,
	  		x: 0,
	  		y: 0
	  	}],
	  	orientation: 'orthogonal',
	  	properties: {},
	  	tileheight: tileheight,
	  	tilesets: [{
	  		firstgid: 1,
	  		image: 'assets/sprites/foresttiles_0.png',
	  		imagewidth: 160,
	  		imageheight: 224,
	  		margin: 0,
	  		name: 'forest-tiles',
	  		properties: {},
	  		spacing: 0,
	  		tileheight: tileheight,
	  		tilewidth: tilewidth
	  	}],
	  	tilewidth: tilewidth,
	  	version: 1,
	  	height: tileheight,
	  	width: tilewidth
	};

	// Тайл со спрайтом земли
	var ARENA = 35;
	var tilepos;

	_map.create(function (x, y, v) {
		jsonmap.layers[0].data[y * width + x] = (v === 1) ? 0 : ARENA;
	});

	_cache.addTilemap(keyName, '', jsonmap);

	var _exist = function (x, y) {
	  	return (
	  		   typeof _map.map[x] !== 'undefined'
	  		&& typeof _map.map[x][y] !== 'undefined'
	  		&& _map.map[x][y] === 0
	  	)
	  		? '1'
	  		: '0';
	};

	var cbSetBackground = function (tile) {
	  	return function () {
	  		jsonmap.layers[0].data[tilepos] = ARENA;
	  		jsonmap.layers[1].data[tilepos] = tile;
	  	};
	};

	var patternArray = [];
	var addPattern = function (pattern, cb) {
	  	patternArray.push({
	  		regex: new RegExp(pattern.replace(/\*/g, '[0-1]')),
	  		cb: cb
	  	});
	};
	addPattern(
		'000' +
		'0*0' +
		'*1*', function (tilepos, x, y) {
			cbSetBackground(14)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 9;
			}
    
		});

	addPattern(
		'000' +
		'0*0' +
		'1*1', function (tilepos, x, y) {
			cbSetBackground(14)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 9;
			}
    
		});

	addPattern(
		'000' +
		'0*0' +
		'001', function (tilepos, x, y) {
			cbSetBackground(6)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 1;
			}
    
		});

	addPattern(
		'00*' +
		'0*1' +
		'*11', function (tilepos, x, y) {
			cbSetBackground(15)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 10;
			}
		});

	addPattern(
		'00*' +
		'0*1' +
		'101', function (tilepos, x, y) {
			cbSetBackground(15)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 10;
			}
		});

	addPattern(
		'000' +
		'0*0' +
		'100', function (tilepos, x, y) {
			cbSetBackground(7)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 2;
			}
		});

	addPattern(
		'00*' +
		'0*1' +
		'00*', cbSetBackground(10));

	addPattern(
		'*1*' +
		'0*0' +
		'000', cbSetBackground(4));


	addPattern(
		'**1' +
		'0*0' +
		'000', cbSetBackground(11));

	addPattern(
		'111' +
		'0**' +
		'001', cbSetBackground(5));


	addPattern(
		'*00' +
		'1*0' +
		'*00', cbSetBackground(8));


	addPattern(
		'*00' +
		'**0' +
		'11*', cbSetBackground(13));

	addPattern(
		'*1*' +
		'1*0' +
		'*00', cbSetBackground(3));

	addPattern(
		'1**' +
		'**0' +
		'*00', cbSetBackground(12));

	addPattern(
		'**1' +
		'0**' +
		'00*', cbSetBackground(5));

	addPattern(
		'001' +
		'0*0' +
		'111', cbSetBackground(15));


	addPattern(
		'*00' +
		'1*0' +
		'1*1', cbSetBackground(13));
	

	// 2 Последних паттерна - декорации (пни)
	addPattern(
		'*1*' +
		'***' +
		'*1*', function () {
			jsonmap.layers[0].data[tilepos] = ARENA;
			var f = [18, 23, 18];
			f = f[Math.floor((Math.random() * 3))];
			jsonmap.layers[1].data[tilepos] = f;
	});
	  
	addPattern(
		'***' +
		'1*1' +
		'***', function () {
			jsonmap.layers[0].data[tilepos] = ARENA;
			var f = [18, 23, 18];
			f = f[Math.floor((Math.random() * 3))];
			jsonmap.layers[1].data[tilepos] = f;
		});


	for (var y = 0; y < _map._height; y++) {
		for (var x = 0; x < _map._width; x++) {
			jsonmap.layers[1].data.push(0);
			if (_map.map[x][y] === 0) {
				continue;
			}
    
			tilepos = y * width + x;
    
			var direction =
				_exist(x - 1, y - 1) + _exist(x, y - 1) + _exist(x + 1, y - 1) +
				_exist(x - 1, y) + '1' + _exist(x + 1, y) +
				_exist(x - 1, y + 1) + _exist(x, y + 1) + _exist(x + 1, y + 1);
		
			for (var i = 0, len = patternArray.length; i < len; i++) {
				if (patternArray[i].regex.test(direction)) {
					patternArray[i].cb(tilepos, x, y);
					break;
				}
			}
    
		}
	}
	
	return _map;
  }
}

export default LevelManager;