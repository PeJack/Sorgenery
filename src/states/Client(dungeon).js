// import Player from 'objects/Player';
// import InputHandler from 'objects/InputHandler';
// import LevelManager from 'systems/LevelManager';
// import Dungeon from 'prefabs/Dungeon';

// class Client extends Phaser.State {
    
//   preload() {
//     this.layers = {};
//     this.running = false;
//     this.tilesize = 12;
//     this.positionUpdated = true;
//     this.visionRadius = 30;
//     this.visited = [];

//     this.game.load.image('tile', 'assets/sprites/tile.png');
//   }

//   create() {
//     // this.levelManager = new LevelManager(this);
//     this.buttonHandler = this.game.buttonHandler;
//     this.inputHandler = new InputHandler(this);

//     this.layers.world = this.game.add.group();
//     this.layers.entities = this.game.add.group();
//     this.layers.polygons = this.game.add.group();

//     this.dungeon = new Dungeon;

//     for(var i = 0; i < this.dungeon.mapSize; i++){
//       for(var j = 0; j < this.dungeon.mapSize; j++){
//            var tile = this.dungeon.map[j][i];
//            if (tile == 0) {
//                 var wall = this.game.add.sprite(i * this.tilesize, j * this.tilesize, "tile");   
//                 wall.tint = 0x222222;       
//            }

//            if(tile == 2) {
//                 var wall = this.game.add.sprite(i * this.tilesize, j * this.tilesize, "tile");   
//                 wall.tint = 0x555555;       
//            }
//       }
//     }

//     this.lineGroup = this.game.add.group();

//     var startCol = this.game.rnd.between(0, this.dungeon.mapSize - 1);
//     var startRow = this.game.rnd.between(0, this.dungeon.mapSize - 1);

//     this.player = new Player(this);
//     this.player.sprite.x = startCol;
//     this.player.sprite.y = startRow;
//     this.game.physics.arcade.enable(this.player.sprite);
//     this.game.camera.follow(this.player.sprite);
//     this.player.sprite.inputEnabled = true;
//     this.player.sprite.body.collideWorldBounds = true;
//     this.player.sprite.inputEnabled = true;

//     // this.layers.background.addChild(this.layers.entities);
//     // this.layers.background.resizeWorld();
//     // this.layers.background.wrap = true;

//     // this.visibility = this.game.add.graphics(0,0);
//     // this.layers.background.mask = this.visibility;
//     // this.layers.collisions.mask = this.visibility;

//     this.run();
//   }

//   run() {
//   }

//   update() {
//     this.player.update();
//     this.game.physics.arcade.collide(this.player.sprite, this.layers.collisions);

//     // if (this.positionUpdated) {
//     //   this.positionUpdated = false;
//     //   this.visited = [];
//     //   this.lineGroup.removeAll(true);
//     //   this.drawVisibilityCircle(this.player.sprite.x / this.tilesize, this.player.sprite.y / this.tilesize, this.visionRadius);
//     // }
//   }

//   drawVisibilityCircle(x0, y0, radius) {
//     let x = -radius
//     let y = 0;
//     let err = 2 - 2 * radius;

//     do {
//       this.castVisibilityRays(this.player.sprite.x / this.tilesize, this.player.sprite.y / this.tilesize, (x0 - x), (y0 + y));
//       this.castVisibilityRays(this.player.sprite.x / this.tilesize, this.player.sprite.y / this.tilesize, (x0 - y), (y0 - x));
//       this.castVisibilityRays(this.player.sprite.x / this.tilesize, this.player.sprite.y / this.tilesize, (x0 + x), (y0 - y));
//       this.castVisibilityRays(this.player.sprite.x / this.tilesize, this.player.sprite.y / this.tilesize, (x0 + y), (y0 + x));
      
//       radius = err;
      
//       if (radius <= y){
//         y++;
//         err += y * 2 + 1;
//       }
      
//       if (radius > x || err > y){
//         x++;
//         err += x * 2 + 1;
//       }
//     } while (x < 0);    
//   }

//   castVisibilityRays(x0, y0, x1, y1) {
//     let lastX0 = x0;
//     let lastY0 = y0;
//     let dx = Math.abs(x1 - x0);
//     let sx = -1;
//     let dy = Math.abs(y1 - y0);
//     let sy = -1;

//     x0 = Math.round(x0);
//     y0 = Math.round(y0);
//     x1 = Math.round(x1);
//     y1 = Math.round(y1);

//     if(x0 < x1){
//       let sx = 1
//     }

//     if(y0 < y1){
//       let sy = 1;
//     }

//     let err = -dy / 2;
//     if(dx > dy){
//       err = dx / 2;
//     }

//     do {
//       let dist = this.distance(lastX0, lastY0, x0, y0);

//       if(x0 < 0 || y0 < 0 || x0 >= this.dungeon.mapSize || y0 >= this.dungeon.mapSize || this.dungeon.map[y0][x0] != 1 || dist > this.visionRadius / 2){
//         break;
//       }

//       if(this.visited.indexOf(x0 + "," + y0) == -1) {
//         let tile = this.game.add.sprite(x0 * this.tilesize, y0 * this.tilesize, "tile");

//         tile.tint = 0xffff00;
//         tile.alpha = 1 - dist / (this.visionRadius / 2);

//         this.visited.push(x0 + "," + y0);
//         this.lineGroup.add(tile);
//       }

//       let e2 = err;
      
//       if(e2 > -dx){
//         err -= dy;
//         x0 += sx;
//       }

//       if(e2 < dy){
//         err += dx;
//         y0 += sy;
//       }
//     } while(x0 != x1 || y0 != y1);
//   }

//   distance(x0, y0, x1, y1){
//     return Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1))     
//   }

//   posToCoord(obj) {
//     return {
//       x: obj.x * this.tilesize + this.tilesize / 2,
//       y: obj.y * this.tilesize + this.tilesize / 2
//     }
//   }

//   getPosition(obj) {
//     return {
//       x: (obj.x - this.tilesize / 2) / this.tilesize,
//       y: (obj.y - this.tilesize / 2 - (obj.off || 0)) / this.tilesize 
//     }
//   }

//   render() {
//     this.game.debug.text(this.game.time.fps || '--', 2, 14, "#a7aebe");
//   }
// }

// export default Client;