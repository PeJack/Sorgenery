import Player from 'objects/Player';
import InputHandler from 'objects/InputHandler';
import LevelManager from 'systems/LevelManager';
import EntityManager from 'systems/EntityManager';
import EffectsManager from 'systems/EffectsManager';

class Client extends Phaser.State {
    
  preload() {
    this.layers = {};
    this.running = false;
    this.positionUpdated = true;
    this.visionRadius = 30;
    this.tilesize = 32;

    this.entityList = [];
    this.entityMap = {};
  }

  create() {
    this.levelManager    = new LevelManager(this);
    this.entityManager   = new EntityManager(this);
    this.buttonHandler   = this.game.buttonHandler;
    this.inputHandler    = new InputHandler(this);

    this.levelManager.init();

    this.layers.entities = this.game.add.group();
    this.layers.effects  = this.game.add.group();
    this.effectsManager  = new EffectsManager(this);

    this.entityManager.init();

    this.player = this.entityList[0];
    // this.player.sprite.x = startCol;
    // this.player.sprite.y = startRow;
    // this.game.physics.arcade.enable(this.player.sprite);
    this.game.camera.follow(this.player.sprite);
    // this.player.sprite.inputEnabled = true;
    // this.player.sprite.body.collideWorldBounds = true;
    
    this.run();
  }

  run() {
    this.levelManager.map.light();
    this.inputHandler.start();
  }

  update() {
    // this.player.update();
    this.inputHandler.update();
    // this.game.physics.arcade.collide(this.player.sprite, this.layers.decoration);

    if (this.positionUpdated) {
      this.positionUpdated = false;
      this.levelManager.map.computeLight();
    }
  }

  posToCoord(obj) {
    return {
      x: obj.x * this.tilesize + this.tilesize / 2,
      y: obj.y * this.tilesize + this.tilesize / 2
    }
  }

  getPosition(obj) {
    return {
      x: (obj.x - this.tilesize / 2) / this.tilesize,
      y: (obj.y - this.tilesize / 2 - (obj.off || 0)) / this.tilesize,
      worldX: (obj.worldX - this.tilesize / 2) / this.tilesize,
      worldY: (obj.worldY - this.tilesize / 2 - (obj.off || 0)) / this.tilesize
    }
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#a7aebe");
  }
}

export default Client;