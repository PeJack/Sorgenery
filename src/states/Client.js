import Player from 'components/Player';
import InputHandler from 'systems/InputHandler';
import MapsManager from 'systems/MapsManager';
import ActorsManager from 'systems/ActorsManager';
import EffectsManager from 'systems/EffectsManager';
import ItemsManager from 'systems/ItemsManager';
import WeaponsManager from 'systems/WeaponsManager';
import Inventory from '../components/Inventory';
import Helpers from 'Helpers';

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
    this.itemsManager    = new ItemsManager(this);
    this.buttonHandler   = this.game.buttonHandler;
    this.inputHandler    = new InputHandler(this);

    this.mapsManager.init();

    this.layers.effects  = this.game.add.group();
    this.layers.items    = this.game.add.group();    
    this.layers.hud      = this.game.add.group();
    this.layers.actors   = this.game.add.group();

    this.effectsManager  = new EffectsManager(this);

    this.actorsManager.init();
    this.itemsManager.init();

    this.player = this.actorsList[0];
    this.inventory = new Inventory(this, this.player);
    this.player.inventory = this.inventory;

    this.game.camera.follow(this.player.sprite);
    
    this.run();
  }

  run() {
    this.inputHandler.start();

    for (let i = 0; i < 50; i++) {
      this.itemsManager.create(Helpers.random(201, 212));
    }

    this.mapsManager.map.light();
  }

  preRender() {
    this.inputHandler.update();
  }

  update() {
    if (this.positionUpdated) {
      this.positionUpdated = false;
      this.mapsManager.map.computeLight();

      this.layers.items.forEach(function(item) {
        if (this.checkOverlap(this.player.sprite, item)) {
          this.player.pickUp(item);
        } 
      }, this)

      this.player.inventory.update();
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
      x: Math.round((obj.x - this.tilesize / 2) / this.tilesize),
      y: Math.round((obj.y - this.tilesize / 2 - (obj.off || 0)) / this.tilesize),
      worldX: (obj.worldX - this.tilesize / 2) / this.tilesize,
      worldY: (obj.worldY - this.tilesize / 2 - (obj.off || 0)) / this.tilesize
    }
  }

  checkOverlap(objA, objB) {
    let boundsA = objA.getBounds();
    let boundsB = objB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#a7aebe");
    // this.game.debug.spriteBounds(this.inventory.background);
    this.game.debug.text(("x: " + this.player.position.x + " y: " + this.player.position.y) || '--', 2, 32, "#a7aebe");
    this.game.debug.text(this.inventory.background.x + " " + this.inventory.background.y || '--', 2, 50, "#a7aebe");    
    this.inventory.items.forEach(function(slot, index) {
      this.game.debug.text("x:" + slot.x +  " y:" + slot.y, 2, 50 + (index + 1) * 15, "#a7aebe");
    }, this)
  }
}

export default Client;