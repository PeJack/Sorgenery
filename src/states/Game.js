import Player from 'objects/Player';
import InputHandler from 'systems/InputHandler';
import LevelManager from 'systems/LevelManager';

class Game extends Phaser.State {
    
  preload() {
    this.layers = {};
    this.running = false;
    this.tilesize = 36;
  }

  create() {
    // this.game.physics.isoArcade.gravity.setTo(0, 0, -500);
    // this.game.iso.projectionAngle = 0.800;
    this.layers.ground = this.game.add.group(this.game.world, "ground");    
    this.layers.objects = this.game.add.group(this.game.world, "objects");

    this.water = [];

    this.level = new LevelManager();
    let tilename;

    for (let y = 0; y < this.level.ground.length; y += 1) {
      for (let x = 0; x < this.level.ground[y].length; x += 1) {
        const tile = this.game.add.isoSprite(this.tilesize * x, this.tilesize * y, 0,
          'tileset', this.level.groundNames[this.level.ground[y][x]], this.layers.ground);

        tile.anchor.set(0.5);
        tile.scale.x = this.level.direction[y][x];
        tile.initialZ = 0;

        if (this.level.ground[y][x] === 0) {
          tile.initialZ = -4;
          this.game.physics.isoArcade.enable(tile);
          tile.body.collideWorldBounds = true;
          tile.body.immovable = true;
          this.water.push(tile);
        }

        if (this.level.ground[y][x] === 4) {
          tile.isoZ += 4;
          tile.initialZ += 4;

          const waterUnderBridge = this.game.add.isoSprite(this.tilesize * x, this.tilesize * y, 0,
            'tileset', this.level.groundNames[0], this.layers.ground);
          waterUnderBridge.anchor.set(0.5, 0.5);
          waterUnderBridge.initialZ = -4;
          this.water.push(waterUnderBridge);
        }
      }
    }

    for (let y = 0; y < this.level.exterior.length; y += 1) {
      for (let x = 0; x < this.level.exterior[y].length; x += 1) {
        if (this.level.exterior[y][x] !== 0) {
          tilename = this.level.exteriorNames[this.level.exterior[y][x]];

          if (tilename.length) {
            const tile = this.game.add.isoSprite(this.tilesize * x, this.tilesize * y, 0,
              'exterior', tilename, this.layers.objects);
              
            tile.initialZ = 0;
            tile.anchor.set(0.5);
            
            if (tilename.indexOf("bush") == -1) {
              this.game.physics.isoArcade.enable(tile);
              tile.body.collideWorldBounds = true;
              tile.body.immovable = true;

              if (tilename == "oak2") {
                tile.body.setSize(tile.body.widthX / 2, tile.body.widthY / 2, tile.body.height, tile.body.widthX / 2, tile.body.widthY / 2);
              } else {
                tile.body.setSize(tile.body.widthX / 2, tile.body.widthY / 2, tile.body.height, tile.body.widthX / 2, tile.body.widthY);
              }
            }
          }
        }
      }
    }

    this.game.iso.simpleSort(this.layers.ground);

    this.run();
  }

  run() {
    this.buttonHandler = this.game.buttonHandler;
    this.player = new Player(this);

    this.game.physics.isoArcade.enable(this.player.sprite);
    this.player.sprite.body.collideWorldBounds = true;
    let playerBody = this.player.sprite.body;
    this.player.sprite.body.setSize(playerBody.widthX * 2.5, playerBody.widthY * 2.5, playerBody.height, playerBody.widthX / 1.5, playerBody.widthY / 1.5);

    this.game.camera.follow(this.player.sprite);

    this.inputHandler = new InputHandler(this);
  }

  update() {
    this.inputHandler.update();
    this.game.physics.isoArcade.collide(this.player.sprite, this.water);
    this.water.forEach((w) => {
      const waterTile = w;
      waterTile.isoZ =
        waterTile.initialZ +
        (-2 * Math.sin((this.game.time.now + (waterTile.isoX * 7)) * 0.004))
        + (-1 * Math.sin((this.game.time.now + (waterTile.isoY * 8)) * 0.005));
      waterTile.alpha = Phaser.Math.clamp(1 + (waterTile.isoZ * 0.1), 0.2, 1);
    });

    this.game.physics.isoArcade.collide(this.layers.objects);
    this.game.iso.simpleSort(this.layers.objects);
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#a7aebe");
    // this.game.debug.bodyInfo(this.player.sprite, 32, 32);
    // this.water.forEach((w) => {
    //   this.game.debug.body(w);
    // })
    this.layers.objects.forEach((obj) => {
      this.game.debug.body(obj);
    })
  }

  posToCoord(obj) {
    return {
      x: obj.x * this.tilesize + this.tilesize / 2,
      y: obj.y * this.tilesize + this.tilesize / 2,
      isoX: obj.isoX * this.tilesize + this.tilesize / 2,
      isoY: obj.isoY * this.tilesize + this.tilesize / 2,      
    }
  }

  getPosition(obj) {
    return {
      x: (obj.x - this.tilesize / 2) / this.tilesize,
      y: (obj.y - this.tilesize / 2 - (obj.off || 0)) / this.tilesize,
      isoX: (obj.isoX - this.tilesize / 2) / this.tilesize,
      isoY: (obj.isoY - this.tilesize / 2 - (obj.off || 0)) / this.tilesize,      
    }
  }
}

export default Game;
    