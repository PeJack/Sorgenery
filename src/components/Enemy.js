import Actor from './Actor';
import Helpers from '../Helpers';

class Enemy extends Actor {
  constructor(client, data, pos) {
    super(client, pos);

    // След характеристики должны получаться из json файла или базы (data)
    this.spriteOffset = 0;
    this.hp = 100;
    this.sp = 110;
    this.damage = 1;
    this.alerted = false;
    this.alertedTime = 5;
    this.movingDelay = 300;

    this.alertedTimer = null;
    this.alertedHasFinished = false;

    this.setAnimations();
  }

  aiAct() {
    if (this.alerted) return;

    if (this.visibleForPlayer) {
      if (this.client.mapsManager.map.computeVisibilityBetween(this, this.client.player)) {
        this.alerted = true;

        let path = [];
        path = this.client.mapsManager.map.pathfinding(this, this.client.player);
        path.shift();
        this.moveTo(path);
      }
    }
    
  }

  moveTo(path) {
    let firstPath = path.shift();

    if (this.client.mapsManager.map.computeVisibilityBetween(this, this.client.player)) {
      if (this.alertedTimer) this.alertedTimer.destroy();
      this.alertedTimer = this.client.game.time.create(false);
      this.alertedTimer.add(this.alertedTime * 1000, function() {
        this.alertedHasFinished = true;
      }, this);
      
      this.alertedTimer.start();
    }

    if (path.length) {
      this.walkToTile(firstPath, null, function () {
        this.moveTo(path);
      }, this)
    } else {
      if (!this.alertedHasFinished) {
        if (!this.alertedTimer.running) {
          this.alertedTimer.start();
        }

        path = this.client.mapsManager.map.pathfinding(this, this.client.player);
        if (path.length > 1) path.shift();
        if (path.length == 1) {
          this.alerted = false;
          return;
        }

        firstPath = path.shift();

        this.walkToTile(firstPath, null, function () {
          this.moveTo(path);
        }, this)
      } else {
        this.alerted = false;
        this.alertedHasFinished = false;
      }
    
    }
  }

}

export default Enemy;