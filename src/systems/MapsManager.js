import Map from '../components/Map';
import ROT from 'rot-js';

class MapsManager {
  constructor(client) {
    this.client = client;
    
    this.cols = 50;
    this.rows = 50;
    this.tilesize = this.client.tilesize;

    this.mapData = this.generateMap('Map', this.client.cache, this.rows, this.cols, this.tilesize, this.tilesize);
  }

  init() {
    let map = this.client.game.add.tilemap('Map');
    map.addTilesetImage('forest-tiles', 'forest-tiles');
    
    this.client.layers.ground = map.createLayer('ground');
    this.client.layers.ground.renderSettings.enableScrollDelta = false;
    this.client.layers.ground.resizeWorld();
    this.client.layers.decoration = map.createLayer('decoration');
    this.client.layers.decoration.renderSettings.enableScrollDelta = false;    
    this.client.layers.decoration.resizeWorld();
	
	  this.map = new Map(this.client, this.mapData, map, this.cols, this.rows);
  }

  generateMap(keyName, _cache, width, height, tilewidth, tileheight) {
    let _map = new ROT.Map.Rogue(width, height);
    
	  let jsonmap = {
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
		let ARENA = 35;
		let tilepos;

		_map.create(function (x, y, v) {
			jsonmap.layers[0].data[y * width + x] = (v === 1) ? 0 : ARENA;
		});

		_cache.addTilemap(keyName, '', jsonmap);

		let _exist = function (x, y) {
		  return (
		  	   typeof _map.map[x] !== 'undefined'
		  	&& typeof _map.map[x][y] !== 'undefined'
		  	&& _map.map[x][y] === 0
		  )
		  	? '1'
		  	: '0';
		};

		let cbSetBackground = function (tile) {
		  	return function () {
		  		jsonmap.layers[0].data[tilepos] = ARENA;
		  		jsonmap.layers[1].data[tilepos] = tile;
		  	};
		};

		let patternArray = [];
		let addPattern = function (pattern, cb) {
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
  	  }
  	);

		addPattern(
			'000' +
			'0*0' +
			'1*1', function (tilepos, x, y) {
				cbSetBackground(14)();
				if (y > 0) {
					jsonmap.layers[1].data[(y - 1) * width + x] = 9;
				}
			
  	  }
  	);

		addPattern(
			'000' +
			'0*0' +
			'001', function (tilepos, x, y) {
				cbSetBackground(6)();
				if (y > 0) {
					jsonmap.layers[1].data[(y - 1) * width + x] = 1;
				}
			
  	  }
  	);

		addPattern(
			'00*' +
			'0*1' +
			'*11', function (tilepos, x, y) {
				cbSetBackground(15)();
				if (y > 0) {
					jsonmap.layers[1].data[(y - 1) * width + x] = 10;
				}
  	  }
  	);

		addPattern(
			'00*' +
			'0*1' +
			'101', function (tilepos, x, y) {
				cbSetBackground(15)();
				if (y > 0) {
					jsonmap.layers[1].data[(y - 1) * width + x] = 10;
				}
  	  }
  	);

		addPattern(
			'000' +
			'0*0' +
			'100', function (tilepos, x, y) {
				cbSetBackground(7)();
				if (y > 0) {
					jsonmap.layers[1].data[(y - 1) * width + x] = 2;
				}
  	  }
  	);

		addPattern(
			'00*' +
			'0*1' +
  	  '00*', cbSetBackground(10)
  	);

		addPattern(
			'*1*' +
			'0*0' +
  	  '000', cbSetBackground(4)
  	);

		addPattern(
			'**1' +
			'0*0' +
  	  '000', cbSetBackground(11)
  	);

		addPattern(
			'111' +
			'0**' +
  	  '001', cbSetBackground(5)
  	);

		addPattern(
			'*00' +
			'1*0' +
  	  '*00', cbSetBackground(8)
  	);

		addPattern(
			'*00' +
			'**0' +
  	  '11*', cbSetBackground(13)
  	);

		addPattern(
			'*1*' +
			'1*0' +
  	  '*00', cbSetBackground(3)
  	);

		addPattern(
			'1**' +
			'**0' +
  	  '*00', cbSetBackground(12)
  	);

		addPattern(
			'**1' +
			'0**' +
  	  '00*', cbSetBackground(5)
  	);

		addPattern(
			'001' +
			'0*0' +
  	  '111', cbSetBackground(15)
  	);

		addPattern(
			'*00' +
			'1*0' +
  	  '1*1', cbSetBackground(13)
  	);

		// 2 Последних паттерна - декорации (пни)
		addPattern(
			'*1*' +
			'***' +
			'*1*', function () {
				jsonmap.layers[0].data[tilepos] = ARENA;
				let f = [18, 23, 18];
				f = f[Math.floor((Math.random() * 3))];
  	    jsonmap.layers[1].data[tilepos] = f;
  	  }
  	);

		addPattern(
			'***' +
			'1*1' +
			'***', function () {
				jsonmap.layers[0].data[tilepos] = ARENA;
				let f = [18, 23, 18];
				f = f[Math.floor((Math.random() * 3))];
				jsonmap.layers[1].data[tilepos] = f;
  	  }
  	);

		for (let y = 0; y < _map._height; y++) {
			for (let x = 0; x < _map._width; x++) {
				jsonmap.layers[1].data.push(0);
				if (_map.map[x][y] === 0) {
					continue;
				}
			
				tilepos = y * width + x;
			
				let direction =
					_exist(x - 1, y - 1) + _exist(x, y - 1) + _exist(x + 1, y - 1) +
					_exist(x - 1, y) + '1' + _exist(x + 1, y) +
					_exist(x - 1, y + 1) + _exist(x, y + 1) + _exist(x + 1, y + 1);
			
				for (let i = 0, len = patternArray.length; i < len; i++) {
					if (patternArray[i].regex.test(direction)) {
						patternArray[i].cb(tilepos, x, y);
						break;
					}
				}
			
			}
		}

		return _map;
	};
	
	canGo(direction) {
    let dir = direction;

    dir.x = Math.round(dir.x);
    dir.y = Math.round(dir.y);
		
		return dir.x >= 0 &&
    dir.x < this.rows &&
    dir.y >= 0 &&
    dir.y < this.cols &&
    this.map.tiles[dir.x][dir.y] === 0;
 	 };
}

export default MapsManager;