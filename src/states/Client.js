import Player from 'objects/Player';
import InputHandler from 'systems/InputHandler';
import MapsManager from 'systems/MapsManager';
import ActorsManager from 'systems/ActorsManager';
import EffectsManager from 'systems/EffectsManager';
import ItemsManager from 'systems/ItemsManager';
import WeaponsManager from 'systems/WeaponsManager';
import VisualTimer from 'systems/VisualTimer';

class Client extends Phaser.State {
    
  preload() {
    this.layers = {};
    this.running = false;
    this.positionUpdated = true;
    this.visionRadius = 30;
    this.tilesize = 32;

    this.actorsList = [];
    this.actorsMap  = {};

    this.weaponsList = [];
    this.weaponsMap  = {};

    this.itemsList = [];
    this.itemsMap = {};
  }

  create() {
    this.mapsManager     = new MapsManager(this);
    this.actorsManager   = new ActorsManager(this);
    this.weaponsManager  = new WeaponsManager(this);
    this.buttonHandler   = this.game.buttonHandler;
    this.inputHandler    = new InputHandler(this);

    this.mapsManager.init();

    this.layers.actors   = this.game.add.group();
    this.layers.effects  = this.game.add.group();
    this.layers.items    = this.game.add.group();    
    this.layers.hud      = this.game.add.group();

    this.effectsManager  = new EffectsManager(this);

    this.actorsManager.init();

    this.player = this.actorsList[0];
    this.game.camera.follow(this.player.sprite);
    
    this.run();
  }

  run() {
    this.mapsManager.map.light();
    this.inputHandler.start();
  }

  preRender() {
    this.inputHandler.update();
  }

  update() {
    if (this.positionUpdated) {
      this.positionUpdated = false;
      this.mapsManager.map.computeLight();
    }

    if (!this.player.weapon.visualTimer.hasFinished) {
      this.player.weapon.update();
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

  // render() {
  //   this.game.debug.text(this.game.time.fps || '--', 2, 14, "#a7aebe");
  // }
}

export default Client;